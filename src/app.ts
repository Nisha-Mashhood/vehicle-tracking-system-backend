import express from "express"
import  cors  from 'cors';
import routes from "./routes/index"
import { API_ROUTE } from "./constants/route-paths";
import dotenv from 'dotenv';

dotenv.config()
const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json())

app.use(API_ROUTE.API, routes)

export default app