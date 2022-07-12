import { verifyCompany } from "./companyServices.js";
import { cardVerificationInfos } from "./cardsServices.js"; 
import { verifyExpirationDate } from "./utilsServices.js";
import { RechargeInsertData } from "../repositories/rechargeRepository.js";

export async function rechargeService(id: number, amount: number, xapikey: string) {
    await verifyCompany(xapikey);
    
    const cardVerification: any = await cardVerificationInfos(id);

    if(cardVerification.isBlocked) {
        throw { status: 409, message: "Card already blocked" };
    }

    const expirationDate = cardVerification.expirationDate;
    await verifyExpirationDate(expirationDate);

    const rechargeInfos: RechargeInsertData = {
            cardId: id,
            amount: amount 
    } 
    return rechargeInfos;
}