import { GPSPointDTO } from "./gps-point-dto"

export interface TripDetailsResponseDTO {
  id: string
  tripName: string

  totalDistance: number
  tripDuration: number
  totalIdling: number
  totalStoppage: number

  overspeedCount: number
  maxSpeed: number

  gpsPoints: GPSPointDTO[]

}