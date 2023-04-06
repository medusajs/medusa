import { Payment } from "../models"
import { dataSource } from "../loaders/database"

export const PaymentRepository = dataSource.getRepository(Payment)
export default PaymentRepository
