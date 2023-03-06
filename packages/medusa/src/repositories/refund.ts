import { dataSource } from "../loaders/database"
import { Refund } from "../models"

export const RefundRepository = dataSource.getRepository(Refund)
export default RefundRepository
