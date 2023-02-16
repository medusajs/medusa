import { PaymentSession } from "../models"
import { dataSource } from "../loaders/database"

export const PaymentSessionRepository = dataSource.getRepository(PaymentSession)
export default PaymentSessionRepository
