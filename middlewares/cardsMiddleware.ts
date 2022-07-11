import { Request, Response, NextFunction } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function newCardsMiddleware(req: Request, res: Response, next: NextFunction) {
    const xApiKey : string  = req.header('x-api-key');
    const { type, employeeId } : { type : TransactionTypes, employeeId : number  } = req.body;

    if(!xApiKey || !type || !employeeId){
        return res.status(422).send("Unprocessable Entity");
    }

    next();
}

export async function cardActivationMiddleware(req: Request, res: Response, next: NextFunction) {
    const { CVC, password, id } : { CVC : string, password : string, id: number } = req.body;

    if(!CVC || !password || !id ) {
        return res.status(422).send("Unprocessable Entity");
    }

    next();
}

export function viewCardStatusMiddleware(req: Request, res: Response, next: NextFunction) {
    const { id } : { id: number } = req.body;

    if(!id) {
        return res.status(422).send("Unprocessable entity");
    }

    next();
}

export function blockUnlockCardMiddleware(req: Request, res: Response, next: NextFunction) {
    const { id, password } : { id: number, password: string }= req.body;
        
    if(!id || !password){
        return res.status(422).send("Unprocessable entity");
    }

    next();
}
