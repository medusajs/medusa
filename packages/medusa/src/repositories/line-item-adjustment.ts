import { LineItemAdjustment } from "../models"
import { dataSource } from "../loaders/database"

export const LineItemAdjustmentRepository =
  dataSource.getRepository(LineItemAdjustment)
export default LineItemAdjustmentRepository
