import { ShippingOption } from "../models"
import { dataSource } from "../loaders/database"

export const ShippingOptionRepository = dataSource.getRepository(ShippingOption)
export default ShippingOptionRepository
