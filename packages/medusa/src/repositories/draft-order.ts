import { DraftOrder } from "../models"
import { dataSource } from "../loaders/database"

export const DraftOrderRepository = dataSource.getRepository(DraftOrder)
export default DraftOrderRepository
