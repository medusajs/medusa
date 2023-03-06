import { dataSource } from "../loaders/database"
import { GiftCardTransaction } from "../models"

export const GiftCardTransactionRepository =
  dataSource.getRepository(GiftCardTransaction)
export default GiftCardTransactionRepository
