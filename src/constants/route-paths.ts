export const AUTH_ROUTES = {
  REGISTER: "/register",
  LOGIN: "/login"
} as const


export const TRIP_ROUTES = {
  UPLOAD: "/upload",
  GET_ALL: "/",
  GET_ONE: "/:tripId"
} as const