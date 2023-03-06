import { dataSource } from "../loaders/database"
import { ShippingMethod } from "../models"

export const ShippingMethodRepository = dataSource.getRepository(ShippingMethod)
export default ShippingMethodRepository
