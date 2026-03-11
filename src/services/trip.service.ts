import { inject, injectable } from "inversify"

import { ITripService } from "../interfaces/services/i-trip-service"
import { ITripRepository } from "../interfaces/repositories/i-trip-repository"

import { UploadTripDTO } from "../interfaces/dtos/upload-trip-dto"
import { TripListResponseDTO } from "../interfaces/dtos/trip-list-response-dto"
import { TripDetailsResponseDTO } from "../interfaces/dtos/trip-details-response-dto"

@injectable()
export class TripService implements ITripService {
    private _tripRepository: ITripRepository

  constructor(
    @inject("ITripRepository") tripRepository: ITripRepository
  ) {
    this._tripRepository = tripRepository
  }

  async uploadTrip(data: UploadTripDTO, filePath: string): Promise<void> {
    console.log("data  : ",data);
    console.log("file path : ",filePath);

    // CSV parsing + trip calculation will be implemented later

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