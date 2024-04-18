import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import {dbConnection} from './server/database/dbConnection.js'
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./server/middlewares/Error.js"; 
import userRouter from "./server/routes/userRouter.js";
import taskRouter from "./server/routes/taskRouter.js";
import bodyParser from "body-parser";

const app = express();
dotenv.config({path : "./config/config.env"});

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET", "PUT", "DELETE", "POST"],
    credentials: true,
}))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
)
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

dbConnection();

app.use(errorMiddleware);

export default app;
