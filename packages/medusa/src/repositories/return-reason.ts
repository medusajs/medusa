import { dataSource } from "../loaders/database"
import { ReturnReason } from "../models"

export const ReturnReasonRepository = dataSource.getRepository(ReturnReason)
export default ReturnReasonRepository
