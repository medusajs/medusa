import { dataSource } from "../loaders/database"
import { ProductTaxRate } from "../models"

export const ProductTaxRateRepository = dataSource.getRepository(ProductTaxRate)
export default ProductTaxRateRepository
