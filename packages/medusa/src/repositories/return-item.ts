import { ReturnItem } from "../models"
import { dataSource } from "../loaders/database"

export const ReturnItemRepository = dataSource.getRepository(ReturnItem)
export default ReturnItemRepository
