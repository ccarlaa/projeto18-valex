import { cardVerificationInfos } from "./cardsServices.js";
import { verifyPassword, verifyExpirationDate } from "./utilsServices.js";
import { findById } from "../repositories/businessRepository.js";
import { findByCardId as findCardPayment} from '../repositories/paymentRepository.js';
import { findByCardId as findCardRecharge } from '../repositories/rechargeRepository.js';
import { PaymentInsertData } from "../repositories/paymentRepository.js";

export async function balance(recharges: any, payments: any) {
    let totalOfPayments = 0;
    for(let payment of payments) {
        totalOfPayments += payment.amount;
    }

    let totalOfRecharges = 0;
    for(let recharge of recharges) {
        totalOfRecharges += recharge.amount;
    }

    const balanceCard = totalOfRecharges - totalOfPayments;

    return balanceCard;
}

export async function verifyEstablishment(establishmentId: number) {
    const establishmentInfos  = await findById(establishmentId);
    if(establishmentInfos == undefined) {
        throw { status: 404, message: `Establishment not registered` }
    }
    return establishmentInfos;
}

export async function paymentServices(cardId: number, password: string, establishmentId: number, amount: number) {
    const cardVerification: any = await cardVerificationInfos(cardId)

    const cardPassword: string = cardVerification.password;
    await verifyPassword(password, cardPassword);

    const expirationDate = cardVerification.expirationDate;
    await verifyExpirationDate(expirationDate)

    if(cardVerification.isBlocked) {
        throw { status: 409, message: "Card blocked" };
    }

    const establishmentInfos = await verifyEstablishment(establishmentId);

    if(establishmentInfos.type != cardVerification.type) {
        throw { status: 401, message: "Card of a different type" };
    }

    const payments = await findCardPayment(cardId);
    const recharges = await findCardRecharge(cardId);
    const balanceTotal = await balance(recharges, payments)

    if(balanceTotal - amount  < 1) {
        throw { status: 401, message: "Insufficient founds" };
    }

    const purchase: PaymentInsertData = {
        cardId: cardId,
        businessId: establishmentId,
        amount: amount
    }

    return purchase;
}