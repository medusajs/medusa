import { dataSource } from "../loaders/database"
import { Currency } from "../models"

export const CurrencyRepository = dataSource.getRepository(Currency)
export default CurrencyRepository
