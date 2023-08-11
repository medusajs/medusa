import { dataSource } from "../loaders/database"
import { Discount } from "../models"

export const DiscountRepository = dataSource.getRepository(Discount)
export default DiscountRepository
