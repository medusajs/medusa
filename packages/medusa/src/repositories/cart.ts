import { Cart } from "../models"
import { dataSource } from "../loaders/database"

export const CartRepository = dataSource.getRepository(Cart)
export default CartRepository
