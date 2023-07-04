import { Refund } from "../models"
import { dataSource } from "../loaders/database"

export const RefundRepository = dataSource.getRepository(Refund)
export default RefundRepository
