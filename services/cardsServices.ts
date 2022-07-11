import { faker } from '@faker-js/faker';
import { findById } from '../repositories/employeeRepository.js';
import dayjs from "dayjs";
import { encrypt } from '../utils/criptografy.js';
import { insert, findById as findCardById } from '../repositories/cardRepository.js';
import { TransactionTypes, activeCard } from "../repositories/cardRepository.js";
import { findByCardId as findCardPayment} from '../repositories/paymentRepository.js';
import { findByCardId as findCardRecharge } from '../repositories/rechargeRepository.js';

export async function newCardService(employeeId: number, type: TransactionTypes) {

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

    const newCard = await insert({
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
    })
}

export async function activationCardService( password : string, id : number ) {
    const passwordEncrypted = encrypt(password);
    await activeCard(id, passwordEncrypted);
}

export async function viewCardStatusService(id: number) {
        const cardVerification = await findCardById(id);
        if(cardVerification == undefined) {
            throw { status: 400, message: 'Card not found' };
        }

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
        return status
}




