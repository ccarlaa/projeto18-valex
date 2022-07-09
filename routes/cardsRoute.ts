import { Router } from "express";
import { newCard } from "../controllers/cardsController.js";
import { newCardsMiddleware } from "../middlewares/cardsMiddleware.js";

const cardsRoute = Router();

cardsRoute.post("/newCard", newCardsMiddleware, newCard);

export default cardsRoute;
