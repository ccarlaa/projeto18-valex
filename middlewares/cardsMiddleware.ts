import { Request, Response, NextFunction } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey,  } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { findByTypeAndEmployeeId } from "../repositories/cardRepository.js";

export async function newCardsMiddleware(req: Request, res: Response, next: NextFunction) {
    const xApiKey: string  = req.header('x-api-key')
    const { type, employeeId } : { type: TransactionTypes, employeeId: number  } = req.body;

    if(!xApiKey || !type || !employeeId){
        return res.status(422).send("Unprocessable Entity")
    }

    try {
        const verifyCompany = await findByApiKey(xApiKey)
        if(verifyCompany == undefined) {
            return res.status(404).send("No company with this api key")
        }
        
        const verifyEmployeeId = await findById(employeeId)
        if(verifyEmployeeId == undefined) {
            return res.status(404).send("No employee with this id")
        }

        const verifyCard = await findByTypeAndEmployeeId(type, employeeId)
        if(verifyCard == undefined) {
            return res.status(404).send(`This employee already has a ${type} card`)
        }
        next()
    } catch (err) {
        res.status(500).send(err)
    }
}