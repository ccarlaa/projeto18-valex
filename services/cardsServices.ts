import { faker } from '@faker-js/faker';
import { findById } from '../repositories/employeeRepository.js';
import { encrypt } from '../utils/criptografy.js';
import { findById as findCardById, CardInsertData } from '../repositories/cardRepository.js';
import { TransactionTypes, findByTypeAndEmployeeId } from "../repositories/cardRepository.js";
import { findByCardId as findCardPayment} from '../repositories/paymentRepository.js';
import { findByCardId as findCardRecharge } from '../repositories/rechargeRepository.js';
import { verifyCompany } from './companyServices.js';
import { verifyEmployee } from './employeeServices.js';
import { balance } from './paymentServices.js';
import { verifyPassword, newPasswordVerification, verifyCVC, verifyExpirationDate } from './utilsServices.js';
import dayjs from "dayjs";

export async function verifyCardByType(type: TransactionTypes, employeeId: number) {
    const verifyCard = await findByTypeAndEmployeeId(type, employeeId);
    if(verifyCard != undefined) {
        throw { status: 404, message: `This employee already has a ${type} card` }
    }
    return;
}

export async function cardVerificationInfos(id: number) {
    const cardVerification: any = await findCardById(id);
    if(cardVerification == undefined) {
        throw { status: 404, message: "Card not found" };
    }
    return cardVerification;
}

export async function newCardService(employeeId: number, type: TransactionTypes, xApiKey: string) {
    await verifyCardByType(type, employeeId)
    await verifyCompany(xApiKey)
    await verifyEmployee(employeeId)

    const cardNumber : string = faker.finance.creditCardNumber();
    const cardCVC : string = faker.finance.creditCardCVV();
    const cardCVVEncrypted = encrypt(cardCVC);

    const { fullName } : { fullName: string} = await findById(employeeId);
    const fullNameArray = fullName.split(" ");
    let middleName = "";
    for(let name = 1; name < fullNameArray.length - 1; name++){
        if(fullNameArray[name].length > 2){
            middleName += " " + fullNameArray[name][0];
        }
    }
    const cardName = fullNameArray[0] + middleName +  " " + fullNameArray[fullNameArray.length - 1];
    
    const expirationDate = dayjs().add(1, 'year').format("MM/YYYY");

    const newCard : CardInsertData = {
        employeeId,
        number: cardNumber,
        cardholderName: cardName,
        securityCode: cardCVVEncrypted,
        expirationDate,
        password: null ,
        isVirtual: false,
        originalCardId: null,
        isBlocked: true,
        type,
    }
    
    return newCard;
}

export async function activationCardService( password : string, id : number, CVC: string) {
    const cardVerification: any = await cardVerificationInfos(id);

    if(!cardVerification.isBlocked){
        throw { status: 409, message: "Card already unlocked"}
    }
    
    await newPasswordVerification(password)

    const CVCcard = cardVerification.securityCode;
    await verifyCVC(CVCcard, CVC);

    const expirationDate = cardVerification.expirationDate;
    await verifyExpirationDate(expirationDate);

    return;
}

export async function viewCardStatusService(id: number) {
    const cardVerification: any = await cardVerificationInfos(id)

    const payments = await findCardPayment(id);

    const recharges = await findCardRecharge(id);

    const balanceTotal: number = await balance(payments, recharges)
    
    const status : object = {
        "balance": balanceTotal,
        "transactions": payments,
        "recharges": recharges 
    }
    return status;
}

export async function blockCardService(id: number, password: string) {
    const cardVerification: any = await cardVerificationInfos(id)

    const cardPassword: string = cardVerification.password;
    await verifyPassword(password, cardPassword);

    const expirationDate = cardVerification.expirationDate;
    await verifyExpirationDate(expirationDate)

    if(cardVerification.isBlocked) {
        throw { status: 409, message: "Card already blocked" };
    }
    return;
}

export async function unlockCardService(id: number, password: string) {
    const cardVerification: any = await cardVerificationInfos(id)

    const cardPassword: string = cardVerification.password;
    await verifyPassword(password, cardPassword);

    const expirationDate = cardVerification.expirationDate;
    await verifyExpirationDate(expirationDate)

    if(!cardVerification.isBlocked) {
        throw { status: 409, message: "Card already unlocked" };
    }
    return;
}


