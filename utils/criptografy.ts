import Cryptr from "cryptr"

const cryptr = new Cryptr("myTotallySecretKey")

export function encrypt(message : string) {
    const messageEncrypted : string = cryptr.encrypt(message)
    return messageEncrypted
}

export function decrypt(message : string) {
    const messageDecrypted : string = cryptr.decrypt(message)
    return messageDecrypted
}