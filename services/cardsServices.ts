import { faker } from '@faker-js/faker';
import { findById } from '../repositories/employeeRepository.js';
import dayjs from "dayjs";
import { encrypt } from '../utils/criptografy.js';
import { insert } from '../repositories/cardRepository.js';
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function newCardService(employeeId: number, type: TransactionTypes) {

    const cardNumber : string = faker.finance.creditCardNumber()
    const cardCVC : string = faker.finance.creditCardCVV()
    const cardCVVEncryted = encrypt(cardCVC)

    const { fullName } : { fullName: string}= await findById(employeeId)
    const fullNameArray = fullName.split(" ")
    let middleName = ""
    for(let name = 1; name < fullNameArray.length - 1; name++){
        if(fullNameArray[name].length > 2){
            middleName += " " + fullNameArray[name][0]
        }
    }
    const cardName = fullNameArray[0] + middleName +  " " + fullNameArray[fullNameArray.length - 1]
    
    const expirationDate = dayjs().add(1, 'year').format("MM/YYYY")

    const newCard = await insert({
        employeeId,
        number: cardNumber,
        cardholderName: cardName,
        securityCode: cardCVVEncryted,
        expirationDate,
        password: null ,
        isVirtual: false,
        originalCardId: null,
        isBlocked: true,
        type,
    })
}