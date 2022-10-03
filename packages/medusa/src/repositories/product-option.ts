import { ProductOption } from "../models"
import { dataSource } from "../loaders/database"

export const ProductOptionRepository = dataSource.getRepository(ProductOption)
export default ProductOptionRepository
