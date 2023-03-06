import { dataSource } from "../loaders/database"
import { OrderEdit } from "../models/order-edit"

export const OrderEditRepository = dataSource.getRepository(OrderEdit)
export default OrderEditRepository
