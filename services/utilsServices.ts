import { decrypt } from "../utils/criptografy.js";
import dayjs from "dayjs";

export async function verifyPassword(password: string, cardPassword: string) {
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

export async function newPasswordVerification(password: string) {
    const passwordNumeric = parseInt(password)
    if(password.length != 4 || passwordNumeric > 10000) {
        throw { status: 401, message: "Invalid password" }
    }
    return;
}

export async function verifyCVC(CVCcard: string, CVC: string) {
    const CVCCardDecrypt = decrypt(CVCcard);
    if(CVCCardDecrypt != CVC) {
        throw { status: 422, message: "Wrong CVC" };
    }
    return;
}

export async function verifyExpirationDate(expirationDate: any) {
   if(dayjs().isBefore(expirationDate)){
       throw { status: 401, message: "Expired card" };
   }
   return;
}