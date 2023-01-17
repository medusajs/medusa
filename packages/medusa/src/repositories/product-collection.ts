import { ProductCollection } from "../models"
import { dataSource } from "../loaders/database"
// eslint-disable-next-line max-len
export const ProductCollectionRepository = dataSource.getRepository(ProductCollection)
export default ProductCollectionRepository
