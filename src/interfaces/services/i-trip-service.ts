import { TripDetailsResponseDTO } from "../dtos/trip-details-response-dto"
import { TripPaginationResponseDTO } from "../dtos/trip-list-response-dto"
import { UploadTripDTO } from "../dtos/upload-trip-dto"


export interface ITripService {

  uploadTrip(data: UploadTripDTO, filePath: string): Promise<void>

  getTrips(
    userId: string,
    search: string | undefined,
    filter: string | undefined,
    page: number,
    limit: number
  ): Promise<TripPaginationResponseDTO>

  getTripDetails(tripId: string): Promise<TripDetailsResponseDTO>

  deleteTrip(tripId: string): Promise<void>

}