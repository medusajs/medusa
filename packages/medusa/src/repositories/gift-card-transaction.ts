import { GiftCardTransaction } from "../models"
import { dataSource } from "../loaders/database"

export const GiftCardTransactionRepository =
  dataSource.getRepository(GiftCardTransaction)
export default GiftCardTransactionRepository
