import { dataSource } from "../loaders/database"
import { Fulfillment } from "../models"

export const FulfillmentRepository = dataSource.getRepository(Fulfillment)
export default FulfillmentRepository
