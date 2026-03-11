import { Schema } from "mongoose"
import { IGPSPoint } from "../interfaces/models/i-gps-point"

export const GPSPointSchema = new Schema<IGPSPoint>(
  {
    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    timestamp: {
      type: Date,
      required: true
    },

    ignition: {
      type: Boolean,
      required: true
    },

    speed: {
      type: Number,
      required: true
    }
  },
  {
    _id: false      //as it is embeded documents inside the trip document
  }
)