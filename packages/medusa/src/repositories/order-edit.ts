import { OrderEdit } from "../models/order-edit"
import { dataSource } from "../loaders/database"

export const OrderEditRepository = dataSource.getRepository(OrderEdit)
export default OrderEditRepository
