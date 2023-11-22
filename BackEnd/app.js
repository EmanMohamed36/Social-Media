import express from "express";
import mongoose from "mongoose";
import router from "./routes/user.js";
import blogRouter from "./routes/blog-routes.js";
import dotenv from "dotenv" 
dotenv.config()

const app = express();
app.use(express.json())
app.use("/api/user", router)
app.use("/api/blog",blogRouter)
mongoose
    .connect(process.env.MongoDbUrl)
    .then(() => app.listen(process.env.PORT))
    .then(() => console.log("connect to mongoDb and listen"))
    .catch((err) => console.log(err))

    //sudo systemctl start mongod
    