import { findById } from "../repositories/employeeRepository.js";

export async function verifyEmployee(employeeId: number) {
    const verifyEmployeeId = await findById(employeeId);
    if(verifyEmployeeId == undefined) {
        throw { status: 404, message: "No employee with this id" }
    }
    return;
}