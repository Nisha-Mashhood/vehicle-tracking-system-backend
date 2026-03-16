export interface IOverspeedEvent {
    startTime:Date,
    endTime:Date,
    startLocation:{
        latitude: number,
        longitude:number,
    },
    endLocation:{
        latitude: number,
        longitude:number,
    },
    maxSpeed:number
}

export interface IStoppageEvent {
    startTime: Date,
    endTime: Date,
    duration: number,
    location:{
        latitude: number,
        longitude:number,
    },

}

export interface IIdlingEvent {
    startTime: Date,
    endTime: Date,
    duration: number,
    location:{
        latitude: number,
        longitude:number,
    },
}
