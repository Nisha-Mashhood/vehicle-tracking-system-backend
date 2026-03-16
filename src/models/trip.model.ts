import { Schema, model } from "mongoose"
import { ITrip } from "../interfaces/models/i-trip"
import { GPSPointSchema } from "./gps-point.schema"
import { IdlingEventSchema, OverspeedEventSchema, StoppageEventSchema } from "./events.schema"

const TripSchema = new Schema<ITrip>(
  {
    userId: {
      type: String,
      required: true
    },

    tripName: {
      type: String,
      required: true
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
      type: Date,
      required: true
    },

    totalDistance: {
      type: Number,
      required: true
    },

    tripDuration: {
      type: Number,
      required: true
    },

    totalIdling: {
      type: Number,
      required: true
    },

    totalStoppage: {
      type: Number,
      required: true
    },

    overspeedCount: {
      type: Number,
      required: true
    },

    maxSpeed: {
      type: Number,
      required: true
    },

    gpsPoints: {
      type: [GPSPointSchema],
      required: true
    },

    overspeedEvents: { 
      type: [OverspeedEventSchema], 
      default: [] 
    }, 
    
    stoppageEvents: { 
      type: [StoppageEventSchema], 
      default: [] 
    }, 
    
    idlingEvents: { 
      type: [IdlingEventSchema], 
      default: [] 
    }
  },
  {
    timestamps: true
  }
)

export const TripModel = model<ITrip>("Trip", TripSchema)