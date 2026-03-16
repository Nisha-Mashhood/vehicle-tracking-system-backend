export interface GPSPointDTO {

  latitude: number
  longitude: number
  timestamp: Date
  ignition: boolean
  speed: number
  isOverspeed?: boolean
  isIdling?: boolean
  isStoppage?: boolean

}