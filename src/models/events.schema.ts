import { Schema } from "mongoose"
import { IIdlingEvent, IOverspeedEvent, IStoppageEvent } from "../interfaces/models/i-event"

export const OverspeedEventSchema = new Schema<IOverspeedEvent>(
  {
    startTime: { 
        type: Date, 
        required: true 
    },

    endTime: { 
        type: Date, 
        required: true 
    },

    startLocation: {
        latitude: { 
            type: Number, 
            required: true 
        },

        longitude: { 
            type: Number, 
            required: true 
        }
    },

    endLocation: {
        latitude: { 
            type: Number, 
            required: true 
        },

        longitude: { 
            type: Number, 
            required: true 
        }
    },

    maxSpeed: { 
        type: Number, 
        required: true 
    }
  },
  {
    _id: false      //as it is embeded documents inside the trip document
  }
)


export const StoppageEventSchema = new Schema<IStoppageEvent>(
  {
    startTime: { 
        type: Date, 
        required: true 
    },

    endTime: { 
        type: Date, 
        required: true 
    },

    duration: { 
        type: Number, 
        required: true 
    },

    location: {
        latitude: { 
            type: Number, 
            required: true 
        },

        longitude: { 
            type: Number, 
            required: true 
        }
    },
  },
  {
    _id: false      //as it is embeded documents inside the trip document
  }
)


export const IdlingEventSchema = new Schema<IIdlingEvent>(
  {
    startTime: { 
        type: Date, 
        required: true 
    },

    endTime: { 
        type: Date, 
        required: true 
    },

    duration: { 
        type: Number, 
        required: true 
    },

    location: {
        latitude: { 
            type: Number, 
            required: true 
        },

        longitude: { 
            type: Number, 
            required: true 
        }
    },
  },
  {
    _id: false      //as it is embeded documents inside the trip document
  }
)