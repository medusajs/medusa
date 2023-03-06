import { dataSource } from "../loaders/database"
import { Store } from "../models"

export const StoreRepository = dataSource.getRepository(Store)
export default StoreRepository
