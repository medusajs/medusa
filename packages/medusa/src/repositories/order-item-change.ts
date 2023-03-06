import { dataSource } from "../loaders/database"
import { OrderItemChange } from "../models"

export const OrderItemChangeRepository =
  dataSource.getRepository(OrderItemChange)
export default OrderItemChangeRepository
