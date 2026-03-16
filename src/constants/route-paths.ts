export const API_ROUTE = {
  API: "/api",
} as const

export const COMMON_ROUTES = {
  AUTH: "/auth",
  TRIPS: "/trips",
} as const

export const AUTH_ROUTES = {
  REGISTER: "/register",
  LOGIN: "/login"
} as const


export const TRIP_ROUTES = {
  UPLOAD: "/upload",
  GET_ALL: "/alltrips",
  GET_ONE: "/details/:tripId",
  DELETE_ONE: "/delete/:tripId"
} as const