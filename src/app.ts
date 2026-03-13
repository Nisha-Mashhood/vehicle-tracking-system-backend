import express from "express"
import  cors  from 'cors';
import routes from "./routes/index"
import { API_ROUTE } from "./constants/route-paths";

const app = express()

app.use(cors())
app.use(express.json())

app.use(API_ROUTE.API, routes)

export default app