import { dataSource } from "../loaders/database"
import { Return } from "../models"

export const ReturnRepository = dataSource.getRepository(Return)
export default ReturnRepository
