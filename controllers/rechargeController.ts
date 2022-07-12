
import { Request, Response } from "express";
import { rechargeService } from "../services/rechargeServices.js";
import { insert } from "../repositories/rechargeRepository.js";

export async function rechargeController(req: Request, res: Response) {
    const xApiKey : string  = req.header('x-api-key');
    const { id, amount } : { id: number, amount: number } = req.body;
    const recharge = await rechargeService(id, amount, xApiKey);
    try {
        await insert(recharge)
    } catch (err) {
        return res.status(500).send(err)
    }
    return res.status(200).send("Card recharged")
}