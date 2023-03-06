import { dataSource } from "../loaders/database"
import { DiscountRule } from "../models"

export const DiscountRuleRepository = dataSource.getRepository(DiscountRule)
export default DiscountRuleRepository
