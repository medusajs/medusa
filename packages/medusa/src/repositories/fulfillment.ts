import { Fulfillment } from "../models"
import { dataSource } from "../loaders/database"

export const FulfillmentRepository = dataSource.getRepository(Fulfillment)
export default FulfillmentRepository
