import { dataSource } from "../loaders/database"
import { ReturnItem } from "../models"

export const ReturnItemRepository = dataSource.getRepository(ReturnItem)
export default ReturnItemRepository
