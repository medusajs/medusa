import { ShippingOptionRequirement } from "../models"
import { dataSource } from "../loaders/database"

export const ShippingOptionRequirementRepository = dataSource.getRepository(
  ShippingOptionRequirement
)
export default ShippingOptionRequirementRepository
