import { dataSource } from "../loaders/database"
import { ShippingTaxRate } from "../models"

export const ShippingTaxRateRepository =
  dataSource.getRepository(ShippingTaxRate)
export default ShippingTaxRateRepository
