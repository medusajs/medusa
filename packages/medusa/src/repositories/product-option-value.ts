import { ProductOptionValue } from "../models"
import { dataSource } from "../loaders/database"

export const ProductOptionValueRepository =
  dataSource.getRepository(ProductOptionValue)
export default ProductOptionValueRepository
