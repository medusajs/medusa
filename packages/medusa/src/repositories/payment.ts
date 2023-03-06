import { dataSource } from "../loaders/database"
import { Payment } from "../models"

export const PaymentRepository = dataSource.getRepository(Payment)
export default PaymentRepository
