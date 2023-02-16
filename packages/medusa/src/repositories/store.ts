import { Store } from "../models"
import { dataSource } from "../loaders/database"

export const StoreRepository = dataSource.getRepository(Store)
export default StoreRepository
