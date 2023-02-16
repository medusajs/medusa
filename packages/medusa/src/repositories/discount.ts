import { Discount } from "../models"
import { dataSource } from "../loaders/database"

export const DiscountRepository = dataSource.getRepository(Discount)
export default DiscountRepository
