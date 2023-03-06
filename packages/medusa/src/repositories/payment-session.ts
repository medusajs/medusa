import { dataSource } from "../loaders/database"
import { PaymentSession } from "../models"

export const PaymentSessionRepository = dataSource.getRepository(PaymentSession)
export default PaymentSessionRepository
