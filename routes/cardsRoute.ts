import { Router } from "express";
import { newCard, cardActivation, viewCardStatus } from "../controllers/cardsController.js";
import { newCardsMiddleware, cardActivationMiddleware, viewCardStatusMiddleware } from "../middlewares/cardsMiddleware.js";

const cardsRoute = Router();

cardsRoute.post("/new-card", newCardsMiddleware, newCard);
cardsRoute.post("/card-activation", cardActivationMiddleware, cardActivation);
cardsRoute.get("/card-status", viewCardStatusMiddleware, viewCardStatus);


export default cardsRoute;
