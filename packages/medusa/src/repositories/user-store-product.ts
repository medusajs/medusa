
import { dataSource } from "../loaders/database"
import { Department } from "../models/department"
import { UserStoreProduct } from "../models/user-store-product"

export const UserStoreProductRepository = dataSource.getRepository(UserStoreProduct)
export default UserStoreProductRepository
