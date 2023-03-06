import { dataSource } from "../loaders/database"
import { ProductOptionValue } from "../models"

export const ProductOptionValueRepository =
  dataSource.getRepository(ProductOptionValue)
export default ProductOptionValueRepository
