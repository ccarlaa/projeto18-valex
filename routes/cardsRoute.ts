import { Router } from "express";
import { newCard, cardActivation, viewCardStatus, blockCard } from "../controllers/cardsController.js";
import { newCardsMiddleware, cardActivationMiddleware, viewCardStatusMiddleware, blockCardMiddleware } from "../middlewares/cardsMiddleware.js";

const cardsRoute = Router();

cardsRoute.post("/new-card", newCardsMiddleware, newCard);
cardsRoute.put("/card-activation", cardActivationMiddleware, cardActivation);
cardsRoute.get("/card-status", viewCardStatusMiddleware, viewCardStatus);
cardsRoute.put("/block-card", blockCardMiddleware, blockCard)


export default cardsRoute;
