import { Request, Response, NextFunction } from "express";

export function paymentMiddleware(req: Request, res: Response, next: NextFunction) {
    const { cardId, password, amount, establishmentId } : { cardId: number, password: string, amount: number, establishmentId: number } = req.body;
        
    if(!cardId || !password || !amount || !establishmentId ){
        return res.status(422).send("Unprocessable entity");
    }

    if(amount < 1){
        return res.status(422).send("Amount less than or equal to 0");
    }

    next();
}