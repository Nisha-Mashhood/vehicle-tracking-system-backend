import { IIdlingEvent, IOverspeedEvent, IStoppageEvent } from "./i-event"
import { IGPSPoint } from "./i-gps-point"

export interface ITrip {

  userId: string

  tripName: string

  startTime: Date
  endTime: Date

  totalDistance: number
  tripDuration: number

  totalIdling: number
  totalStoppage: number

  overspeedCount: number
  maxSpeed: number

  gpsPoints: IGPSPoint[]
  overspeedEvents: IOverspeedEvent[]
  stoppageEvents : IStoppageEvent[]
  idlingEvents: IIdlingEvent[]

}