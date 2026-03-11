import { TripDetailsResponseDTO } from "../dtos/trip-details-response-dto"
import { TripListResponseDTO } from "../dtos/trip-list-response-dto"
import { UploadTripDTO } from "../dtos/upload-trip-dto"


export interface ITripService {

  uploadTrip(data: UploadTripDTO, filePath: string): Promise<void>

  getTrips(userId: string): Promise<TripListResponseDTO[]>

  getTripDetails(tripId: string): Promise<TripDetailsResponseDTO>

}