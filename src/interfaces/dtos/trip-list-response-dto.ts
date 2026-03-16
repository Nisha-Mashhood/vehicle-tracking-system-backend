export interface TripListResponseDTO {

  id: string
  tripName: string
  totalDistance: number
  tripDuration: number
  startTime: Date
  endTime: Date

}

export interface TripPaginationResponseDTO {
  trips: TripListResponseDTO[]
  total: number
  page: number
  limit: number
  totalPages: number
}