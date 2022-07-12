
import { Request, Response } from "express";
import { paymentServices } from "../services/paymentServices.js";
import { insert } from "../repositories/paymentRepository.js";

export async function paymentController(req: Request, res: Response) {
    const { cardId, password, establishmentId, amount } : { cardId: number, password: string, amount: number, establishmentId: number} = req.body;
    const purchase = await paymentServices(cardId, password, establishmentId, amount);
    try {
        await insert(purchase);
    } catch (err) {
        return res.status(500).send(err)
    }
    return res.status(200).send("Successful payment")
}