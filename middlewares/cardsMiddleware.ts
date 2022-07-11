import { Request, Response, NextFunction } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey,  } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { findByTypeAndEmployeeId, findById as findCardById } from "../repositories/cardRepository.js";
import { decrypt } from "../utils/criptografy.js";
import dayjs from "dayjs";

export async function newCardsMiddleware(req: Request, res: Response, next: NextFunction) {
    const xApiKey : string  = req.header('x-api-key');
    const { type, employeeId } : { type : TransactionTypes, employeeId : number  } = req.body;

    if(!xApiKey || !type || !employeeId){
        return res.status(422).send("Unprocessable Entity");
    }

    try {
        const verifyCompany = await findByApiKey(xApiKey);
        if(verifyCompany == undefined) {
            return res.status(404).send("No company with this api key");
        }
        
        const verifyEmployeeId = await findById(employeeId);
        if(verifyEmployeeId == undefined) {
            return res.status(404).send("No employee with this id");
        }

        const verifyCard = await findByTypeAndEmployeeId(type, employeeId);
        if(verifyCard != undefined) {
            return res.status(404).send(`This employee already has a ${type} card`);
        }
        next();
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function cardActivationMiddleware(req: Request, res: Response, next: NextFunction) {
    const { CVC, password, id } : { CVC : string, password : string, id: number } = req.body;
    const CVCdecrypt = decrypt(CVC);

    if(!CVC || !password || !id ) {
        return res.status(422).send("Unprocessable Entity");
    }

    if(password.length != 4) {
        return res.status(422).send("Password must have 4 numbers");
    }

    try {
        const cardVerification = await findCardById(id);
        if(cardVerification == undefined) {
            return res.status(404).send(`Card not found`);
        }

        const expirationDate = cardVerification.expirationDate;
        const CVCcard = cardVerification.securityCode;
        const CVCCardDecrypt = decrypt(CVCcard);

        if(CVCCardDecrypt != CVCdecrypt) {
            return res.status(422).send("Wrong CVC");
        }

        if(dayjs().isBefore(expirationDate)){
            return res.status(401).send(`Expired card`);
        }
        next();
    } catch (err) {
        res.status(500).send(err);
    }
}

export function viewCardStatusMiddleware(req: Request, res: Response, next: NextFunction) {
    const { id } : { id: number } = req.body;
    if(!id) {
        return res.status(422).send("Unprocessable entity");
    }
    next()
}