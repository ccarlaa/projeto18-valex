
import { Request, Response } from "express";
import { newCardService, activationCardService, viewCardStatusService } from "../services/cardsServices.js";
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

export async function cardActivation(req: Request, res: Response) {
    const { id, password } : { id : number, password : string  } = req.body;
    try {
        activationCardService(password, id)
        return res.status(200).send("Card unlocked")
    } catch(err) {
        return res.status(500)
    }
}

export async function viewCardStatus(req: Request, res: Response) {
    const { id } : { id: number } = req.body;
    const status = await viewCardStatusService(id);
    return res.status(200).send(status)
}