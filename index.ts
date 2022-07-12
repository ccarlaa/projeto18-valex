import cors from "cors";
import express, {json} from "express";
import dotenv from "dotenv";
import "express-async-errors";

import cardsRoute from "./routes/cardsRoute.js"
import rechargeRoute from "./routes/rechargeRoutes.js";
import errorHandle from "./middlewares/handErros.js"
import { userInfo } from "os";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(cardsRoute)
app.use(rechargeRoute)
app.use(errorHandle)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`|-----------------------------------|`)
    console.log(`| Running at http://localhost:${port}  |`)
    console.log(`|-----------------------------------|`)
})
