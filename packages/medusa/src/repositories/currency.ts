import { Currency } from "../models"
import { dataSource } from "../loaders/database"

export const CurrencyRepository = dataSource.getRepository(Currency)
export default CurrencyRepository
