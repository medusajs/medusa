import { dataSource } from "../loaders/database"
import { ShippingOptionRequirement } from "../models"

export const ShippingOptionRequirementRepository = dataSource.getRepository(
  ShippingOptionRequirement
)
export default ShippingOptionRequirementRepository
