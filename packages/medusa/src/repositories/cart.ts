import { EntityRepository, Repository } from "typeorm"
import { Cart } from "../models/cart"

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {}
