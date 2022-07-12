import { Request, Response, NextFunction } from "express";

export function rechargeMiddleware(req: Request, res: Response, next: NextFunction) {
    const xApiKey : string  = req.header('x-api-key');
    const { id, amount } : { id: number, amount: number } = req.body;
        
    if(!id || !xApiKey || !amount ){
        return res.status(422).send("Unprocessable entity");
    }

    if(amount < 10){
        return res.status(422).send("Amount less than 10");
    }

    next();
}