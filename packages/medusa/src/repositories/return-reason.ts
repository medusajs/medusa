import { ReturnReason } from "../models"
import { dataSource } from "../loaders/database"

export const ReturnReasonRepository = dataSource.getRepository(ReturnReason)
export default ReturnReasonRepository
