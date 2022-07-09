
import { Request, Response } from "express";
import { newCardService } from "../services/cardsServices.js";
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function newCard(req: Request, res: Response) {
    const xApiKey : string  = req.header('x-api-key')
    const { type, employeeId } : { type : TransactionTypes, employeeId : number  } = req.body;
    try {
        newCardService(employeeId, type)
        return res.status(201).send("Card created")
    } catch(err) {
        return res.status(500)
    }
}