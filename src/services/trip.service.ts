import fs from "fs"
import { inject, injectable } from "inversify"
import csv from "csv-parser"
import geolib from "geolib"

import { ITripService } from "../interfaces/services/i-trip-service"
import { ITripRepository } from "../interfaces/repositories/i-trip-repository"

import { UploadTripDTO } from "../interfaces/dtos/upload-trip-dto"
import { TripListResponseDTO } from "../interfaces/dtos/trip-list-response-dto"
import { TripDetailsResponseDTO } from "../interfaces/dtos/trip-details-response-dto"
import { IGPSPoint } from "../interfaces/models/i-gps-point"

@injectable()
export class TripService implements ITripService {
    private _tripRepository: ITripRepository

  constructor(
    @inject("ITripRepository") tripRepository: ITripRepository
  ) {
    this._tripRepository = tripRepository
  }

  async uploadTrip(data: UploadTripDTO, filePath: string): Promise<void> {
    const gpsPoints: IGPSPoint[] = []

    await new Promise<void>((resolve, reject) => {

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {

          gpsPoints.push({
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            timestamp: new Date(row.timestamp),
            ignition: row.ignition === "true",
            speed: 0,
          })

        })
        .on("end", resolve)
        .on("error", reject)

    })

    if (gpsPoints.length === 0) {
      throw new Error("CSV file contains no GPS data")
    }

    // ---------- Calculations ----------

    let totalDistance = 0
    let totalIdling = 0
    let totalStoppage = 0
    let overspeedCount = 0
    let maxSpeed = 0

    for (let i = 1; i < gpsPoints.length; i++) {

      const prev = gpsPoints[i - 1]
      const curr = gpsPoints[i]

      const distance = geolib.getDistance(
        { latitude: prev.latitude, longitude: prev.longitude },
        { latitude: curr.latitude, longitude: curr.longitude }
      )

      totalDistance += distance

      const timeDiff =
        (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000

      const speed = timeDiff > 0 ? (distance / timeDiff) * 3.6 : 0

      if (speed > maxSpeed) {
        maxSpeed = speed
      }

      if (speed > 60) {
        overspeedCount++
      }

      // Idling → ignition ON but no movement
      if (curr.ignition && distance === 0) {
        totalIdling += timeDiff
      }

      // Stoppage → ignition OFF
      if (!curr.ignition) {
        totalStoppage += timeDiff
      }

    }

    const startTime = gpsPoints[0].timestamp
    const endTime = gpsPoints[gpsPoints.length - 1].timestamp

    const tripDuration =
      (endTime.getTime() - startTime.getTime()) / 1000

    // ---------- Save Trip ----------

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

      gpsPoints

    })

  }

  async getTrips(userId: string): Promise<TripListResponseDTO[]> {

    const trips = await this._tripRepository.findTripsByUser(userId)

    return trips.map(trip => ({
      id: trip._id.toString(),
      tripName: trip.tripName,
      totalDistance: trip.totalDistance,
      tripDuration: trip.tripDuration,
      startTime: trip.startTime,
      endTime: trip.endTime
    }))

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
      gpsPoints: trip.gpsPoints
    }

  }

}