import { ProductCollection } from "../models"
import { dataSource } from "../loaders/database"

export const ProductCollectionRepository =
  dataSource.getRepository(ProductCollection)
export default ProductCollectionRepository
