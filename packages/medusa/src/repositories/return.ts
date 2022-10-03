import { Return } from "../models"
import { dataSource } from "../loaders/database"

export const ReturnRepository = dataSource.getRepository(Return)
export default ReturnRepository
