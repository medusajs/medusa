import { ShippingTaxRate } from "../models"
import { dataSource } from "../loaders/database"

export const ShippingTaxRateRepository =
  dataSource.getRepository(ShippingTaxRate)
export default ShippingTaxRateRepository
