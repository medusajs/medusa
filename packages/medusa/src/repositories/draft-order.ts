import { dataSource } from "../loaders/database"
import { DraftOrder } from "../models"

export const DraftOrderRepository = dataSource.getRepository(DraftOrder)
export default DraftOrderRepository
