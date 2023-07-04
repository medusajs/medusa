import { ProductTaxRate } from "../models"
import { dataSource } from "../loaders/database"

export const ProductTaxRateRepository = dataSource.getRepository(ProductTaxRate)
export default ProductTaxRateRepository
