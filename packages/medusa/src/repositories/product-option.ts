import { dataSource } from "../loaders/database"
import { ProductOption } from "../models"

export const ProductOptionRepository = dataSource.getRepository(ProductOption)
export default ProductOptionRepository
