import { Router } from "express";
import { newCard, cardActivation, viewCardStatus, blockCard, unlockCard } from "../controllers/cardsController.js";
import { newCardsMiddleware, cardActivationMiddleware, viewCardStatusMiddleware, blockUnlockCardMiddleware } from "../middlewares/cardsMiddleware.js";

const cardsRoute = Router();

cardsRoute.post("/new-card", newCardsMiddleware, newCard);
cardsRoute.put("/card-activation", cardActivationMiddleware, cardActivation);
cardsRoute.get("/card-status", viewCardStatusMiddleware, viewCardStatus);
cardsRoute.put("/block-card", blockUnlockCardMiddleware, blockCard)
cardsRoute.put("/unlock-card", blockUnlockCardMiddleware, unlockCard)

export default cardsRoute;
