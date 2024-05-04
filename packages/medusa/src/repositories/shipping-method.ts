import { ShippingMethod } from "../models"
import { dataSource } from "../loaders/database"

export const ShippingMethodRepository = dataSource.getRepository(ShippingMethod)
export default ShippingMethodRepository
