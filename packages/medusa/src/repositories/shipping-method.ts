import { dataSource } from "../loaders/database"
import { ShippingMethod } from "../models/shipping-method"

export const ShippingMethodRepository = dataSource.getRepository(ShippingMethod)

export default ShippingMethodRepository
