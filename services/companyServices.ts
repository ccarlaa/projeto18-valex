import { findByApiKey } from "../repositories/companyRepository.js";

export async function verifyCompany(xApiKey: string) {
    const verifyCompany = await findByApiKey(xApiKey);
    if(verifyCompany == undefined) {
        throw { status: 404, message: "No company with this api key" }
    }
    return;
}