import { DiscountRule } from "../models"
import { dataSource } from "../loaders/database"

export const DiscountRuleRepository = dataSource.getRepository(DiscountRule)
export default DiscountRuleRepository
