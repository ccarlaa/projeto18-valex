import { faker } from '@faker-js/faker';
import { findById } from '../repositories/employeeRepository.js';
import { encrypt } from '../utils/criptografy.js';
import { decrypt } from '../utils/criptografy.js';
import { findById as findCardById, CardInsertData } from '../repositories/cardRepository.js';
import { TransactionTypes, findByTypeAndEmployeeId } from "../repositories/cardRepository.js";
import { findByCardId as findCardPayment} from '../repositories/paymentRepository.js';
import { findByCardId as findCardRecharge } from '../repositories/rechargeRepository.js';
import { findByApiKey } from '../repositories/companyRepository.js';
import dayjs from "dayjs";

 async function verifyEmployee(employeeId: number) {
    const verifyEmployeeId = await findById(employeeId);
    if(verifyEmployeeId == undefined) {
        throw { status: 404, message: "No employee with this id" }
    }
    return;
}

 async function verifyCompany(xApiKey: string) {
    const verifyCompany = await findByApiKey(xApiKey);
    if(verifyCompany == undefined) {
        throw { status: 404, message: "No company with this api key" }
    }
    return;
}

 async function verifyCardByType(type: TransactionTypes, employeeId: number) {
    const verifyCard = await findByTypeAndEmployeeId(type, employeeId);
    if(verifyCard != undefined) {
        throw { status: 404, message: `This employee already has a ${type} card` }
    }
    return;
}

 async function verifyPassword(password: string, cardPassword: string) {
    const passwordNumeric = parseInt(password)
    if(password.length != 4 || passwordNumeric > 10000) {
        throw { status: 401, message: "Invalid password" }
    }
    const cardPasswordDecrypted = decrypt(cardPassword);
    if (cardPasswordDecrypted != password) {
        throw { status: 401, message: "Wrong password" }
    }
    return;
}

async function newPasswordVerification(password: string) {
    const passwordNumeric = parseInt(password)
    if(password.length != 4 || passwordNumeric > 10000) {
        throw { status: 401, message: "Invalid password" }
    }
    return;
}

 async function verifyCVC(CVCcard: string, CVC: string) {
    const CVCCardDecrypt = decrypt(CVCcard);
    const CVCdecrypt = decrypt(CVC);
    if(CVCCardDecrypt != CVCdecrypt) {
        throw { status: 422, message: "Wrong CVC" };
    }
    return;
}

 async function verifyExpirationDate(expirationDate: any) {
    if(dayjs().isBefore(expirationDate)){
        throw { status: 401, message: "Expired card" };
    }
    return;
}

 async function cardVerificationInfos(id: number) {
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
    let totalOfPayments = 0;
    for(let payment of payments) {
        totalOfPayments += payment.amount;
    }

    const recharges = await findCardRecharge(id);
    let totalOfRecharges = 0;
    for(let recharge of recharges) {
        totalOfRecharges += recharge.amount;
    }

    const balance = recharges - payments;

    const status : object = {
        "balance": balance,
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


