import fs from "fs"
import { inject, injectable } from "inversify"
import csv from "csv-parser"
import { getDistance } from "geolib"

import { ITripService } from "../interfaces/services/i-trip-service"
import { ITripRepository } from "../interfaces/repositories/i-trip-repository"

import { UploadTripDTO } from "../interfaces/dtos/upload-trip-dto"
import { TripListResponseDTO, TripPaginationResponseDTO } from "../interfaces/dtos/trip-list-response-dto"
import { TripDetailsResponseDTO } from "../interfaces/dtos/trip-details-response-dto"
import { IGPSPoint } from "../interfaces/models/i-gps-point"
import { IIdlingEvent, IOverspeedEvent, IStoppageEvent } from "../interfaces/models/i-event"

@injectable()
export class TripService implements ITripService {
    private _tripRepository: ITripRepository

  constructor(
    @inject("ITripRepository") tripRepository: ITripRepository
  ) {
    this._tripRepository = tripRepository
  }

  //upload the CSV file do calculation and save in database
  async uploadTrip(data: UploadTripDTO, filePath: string): Promise<void> {
  const gpsPoints: IGPSPoint[] = [];
  const overspeedEvents: IOverspeedEvent[] = [];
  let stoppageEvents: IStoppageEvent[] = [];
  let idlingEvents: IIdlingEvent[] = [];

  let overspeedStart: IGPSPoint | null = null;
  let stoppageStart: IGPSPoint | null = null;
  let idlingStart: IGPSPoint | null = null;

  // Parse CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        gpsPoints.push({
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
          timestamp: new Date(row.timestamp),
          ignition: row.ignition?.toLowerCase() === "on" || row.ignition === "true",
          speed: 0,
          isOverspeed: false,
          isIdling: false,
          isStoppage: false,
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  if (gpsPoints.length === 0) throw new Error("CSV file contains no GPS data");

  // Sort by time
  gpsPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  let totalDistance = 0;
  let totalIdling = 0;
  let totalStoppage = 0;
  let overspeedCount = 0;
  let maxSpeed = 0;

  // PROCESSING LOOP
  for (let i = 1; i < gpsPoints.length; i++) {
    const prev = gpsPoints[i - 1];
    const curr = gpsPoints[i];

    const distance = getDistance(
      { latitude: prev.latitude, longitude: prev.longitude },
      { latitude: curr.latitude, longitude: curr.longitude }
    );

    const timeDiff = (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000;

    // Calculate speed
    let speed = 0;
    if (timeDiff > 0) {
      speed = (distance / timeDiff) * 3.6;
      curr.speed = Number(speed.toFixed(2));
      totalDistance += distance;
      if (speed > maxSpeed) maxSpeed = speed;
    } else {
      curr.speed = 0;
    }

    // OVERSPEED
    if (speed > 60) {
      curr.isOverspeed = true;
      if (!overspeedStart) {
        overspeedStart = curr;
        overspeedCount++;
      }
    } else if (overspeedStart) {
      overspeedEvents.push({
        startTime: overspeedStart.timestamp,
        endTime: curr.timestamp,
        startLocation: { latitude: overspeedStart.latitude, longitude: overspeedStart.longitude },
        endLocation: { latitude: curr.latitude, longitude: curr.longitude },
        maxSpeed: curr.speed,
      });
      overspeedStart = null;
    }

    // IDLING
    if (curr.ignition && speed < 3) {
      curr.isIdling = true;
      if (!idlingStart) idlingStart = prev;           // start from previous point
      if (timeDiff > 0) totalIdling += timeDiff;
    } else if (idlingStart) {
      const duration = (prev.timestamp.getTime() - idlingStart.timestamp.getTime()) / 1000;
      if (duration > 0) {
        idlingEvents.push({
          startTime: idlingStart.timestamp,
          endTime: prev.timestamp,
          duration,
          location: { latitude: idlingStart.latitude, longitude: idlingStart.longitude },
        });
    }
      idlingStart = null;
      curr.isIdling = false;
    }

    // STOPPAGE
    if (!curr.ignition && speed < 3) {
      curr.isStoppage = true;
      if (!stoppageStart) stoppageStart = prev;
      if (timeDiff > 0) totalStoppage += timeDiff;
    } else if (stoppageStart) {
      const duration = (prev.timestamp.getTime() - stoppageStart.timestamp.getTime()) / 1000;
      if (duration > 0) {
        stoppageEvents.push({
          startTime: stoppageStart.timestamp,
          endTime: prev.timestamp,
          duration,
          location: { latitude: stoppageStart.latitude, longitude: stoppageStart.longitude },
        });
      }
      stoppageStart = null;
      curr.isStoppage = false;
    }
  }

  // Close any open events at the end of the file
  const lastPoint = gpsPoints[gpsPoints.length - 1];

  if (overspeedStart) {
    overspeedEvents.push({
      startTime: overspeedStart.timestamp,
      endTime: lastPoint.timestamp,
      startLocation: { latitude: overspeedStart.latitude, longitude: overspeedStart.longitude },
      endLocation: { latitude: lastPoint.latitude, longitude: lastPoint.longitude },
      maxSpeed,
    });
  }

  if (idlingStart) {
    const duration = (lastPoint.timestamp.getTime() - idlingStart.timestamp.getTime()) / 1000;
    if (duration > 0) {
      idlingEvents.push({
        startTime: idlingStart.timestamp,
        endTime: lastPoint.timestamp,
        duration,
        location: { latitude: idlingStart.latitude, longitude: idlingStart.longitude },
      });
    }
  }

  if (stoppageStart) {
    const duration = (lastPoint.timestamp.getTime() - stoppageStart.timestamp.getTime()) / 1000;
    if (duration > 0) {
    stoppageEvents.push({
        startTime: stoppageStart.timestamp,
        endTime: lastPoint.timestamp,
        duration,
        location: { latitude: stoppageStart.latitude, longitude: stoppageStart.longitude },
      });
    }
  }

  // Final totals
  const startTime = gpsPoints[0].timestamp;
  const endTime = lastPoint.timestamp;
  const tripDuration = (endTime.getTime() - startTime.getTime()) / 1000;

  idlingEvents = idlingEvents.filter(e => e.duration > 0);
  stoppageEvents = stoppageEvents.filter(e => e.duration > 0);


  totalIdling = idlingEvents.reduce((sum, e) => sum + e.duration, 0);
  totalStoppage = stoppageEvents.reduce((sum, e) => sum + e.duration, 0);

  console.log(`✅ Uploaded trip with ${idlingEvents.length} idling events, ${stoppageEvents.length} stoppage events`);

  //Save to database
  await this._tripRepository.create({
    userId: data.userId,
    tripName: data.tripName,
    startTime,
    endTime,
    totalDistance,
    tripDuration,
    totalIdling,
    totalStoppage,
    overspeedCount,
    maxSpeed,
    gpsPoints,
    overspeedEvents,
    stoppageEvents,
    idlingEvents,
  });

  fs.unlinkSync(filePath);
}


  async getTrips(
      userId: string,
      search: string | undefined,
      filter: string | undefined,
      page: number,
      limit: number
    ): Promise<TripPaginationResponseDTO> {

      const { trips, total } =
        await this._tripRepository.findTripsByUser(
          userId,
          search,
          filter,
          page,
          limit
        )

      const tripDTOs: TripListResponseDTO[] = trips.map(trip => ({
        id: trip._id.toString(),
        tripName: trip.tripName,
        totalDistance: trip.totalDistance,
        tripDuration: trip.tripDuration,
        startTime: trip.startTime,
        endTime: trip.endTime
      }))

      const totalPages = Math.ceil(total / limit)

      return {
        trips: tripDTOs,
        total,
        page,
        limit,
        totalPages
      }
    }

  async getTripDetails(tripId: string): Promise<TripDetailsResponseDTO> {

    const trip = await this._tripRepository.findById(tripId)
    if (!trip) {
      throw new Error("Trip not found")
    }

    return {
      id: trip._id.toString(),
      tripName: trip.tripName,
      totalDistance: trip.totalDistance,
      tripDuration: trip.tripDuration,
      totalIdling: trip.totalIdling,
      totalStoppage: trip.totalStoppage,
      overspeedCount: trip.overspeedCount,
      maxSpeed: trip.maxSpeed,
      gpsPoints: trip.gpsPoints,
      overspeedEvents: trip.overspeedEvents,
      stoppageEvents: trip.stoppageEvents,
      idlingEvents: trip.idlingEvents
    }

  }

  async deleteTrip(tripId: string): Promise<void> {
   const trip = await this._tripRepository.findById(tripId)
      if (!trip) {
        throw new Error("Trip not found")
      }
    await this._tripRepository.deleteById(tripId)
  }
}