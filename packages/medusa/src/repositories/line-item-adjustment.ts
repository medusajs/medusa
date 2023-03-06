import { dataSource } from "../loaders/database"
import { LineItemAdjustment } from "../models"

export const LineItemAdjustmentRepository =
  dataSource.getRepository(LineItemAdjustment)
export default LineItemAdjustmentRepository
