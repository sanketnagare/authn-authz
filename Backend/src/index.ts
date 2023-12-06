import express, {Request, Response} from "express";
import { dbconnect } from "./config/db.js";
import dotenv from "dotenv"
import router from "./routes/studentRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser())
app.use(cors())

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

app.use("/api/v1", router);

dbconnect();



