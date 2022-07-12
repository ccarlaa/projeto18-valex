import { Router } from "express";
import { paymentMiddleware } from "../middlewares/paymentMiddleware.js";
import { paymentController } from "../controllers/paymentController.js";

const paymentRoute = Router();

paymentRoute.post("/payment", paymentMiddleware, paymentController);

export default paymentRoute;
