import { dataSource } from "../loaders/database"
import { Cart } from "../models"

export const CartRepository = dataSource.getRepository(Cart)
export default CartRepository
