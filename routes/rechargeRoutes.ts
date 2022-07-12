import { Router } from "express";
import { rechargeMiddleware } from "../middlewares/rechargeMiddleware.js";
import { rechargeController } from "../controllers/rechargeController.js";

const rechargeRoute = Router();

rechargeRoute.post("/recharge", rechargeMiddleware, rechargeController);

export default rechargeRoute;
