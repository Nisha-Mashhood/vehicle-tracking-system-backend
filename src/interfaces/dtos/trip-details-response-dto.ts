import { IIdlingEvent, IOverspeedEvent, IStoppageEvent } from "../models/i-event"
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
  overspeedEvents: IOverspeedEvent[]
  stoppageEvents : IStoppageEvent[]
  idlingEvents: IIdlingEvent[]

}