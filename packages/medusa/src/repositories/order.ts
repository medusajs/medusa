import { Order } from "../models"
import { dataSource } from "../loaders/database"

export const OrderRepository = dataSource.getRepository(Order)
