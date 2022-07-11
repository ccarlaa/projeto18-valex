
import { Request, Response } from "express";
import { newCardService, activationCardService, viewCardStatusService, blockCardService, unlockCardService } from "../services/cardsServices.js";
import { blockCard as blockCardRepository, insert, activeCard } from "../repositories/cardRepository.js";
import { TransactionTypes } from "../repositories/cardRepository.js";
import { encrypt } from "../utils/criptografy.js";

export async function newCard(req: Request, res: Response) {
    const xApiKey : string  = req.header('x-api-key')
    const { type, employeeId } : { type : TransactionTypes, employeeId : number  } = req.body;
    const cardData = await newCardService(employeeId, type, xApiKey)
    try {
        await insert(cardData)
    } catch (err) {
        return res.status(500).send(err)
    }
    return res.status(201).send("Card created")
}

export async function cardActivation(req: Request, res: Response) {
    const { id, password, CVC } : { id : number, password : string, CVC: string  } = req.body;
    await activationCardService(password, id, CVC);
    const passwordEncrypted = encrypt(password);
    try {
        await activeCard(id, passwordEncrypted)
    } catch (err) {
        return res.status(500).send(err)
    }
    return res.status(200).send("Card unlocked")
}

export async function viewCardStatus(req: Request, res: Response) {
    const { id } : { id: number } = req.body;
    const status = await viewCardStatusService(id);
    return res.status(200).send(status)
}

export async function blockCard(req: Request, res: Response) {
    const { id, password } : { id: number, password: string } = req.body;
    await blockCardService(id, password);
    try {
        await blockCardRepository(id, true);
    } catch (err) {
        return res.status(500).send(err)
    }
    return res.status(200).send("Card blocked")
}

export async function unlockCard(req: Request, res: Response) {
    const { id, password } : { id: number, password: string } = req.body;
    await unlockCardService(id, password);
    try {
        await blockCardRepository(id, false);
    } catch (err) {
        return res.status(500).send(err)
    }
    return res.status(200).send("Card blocked")
}