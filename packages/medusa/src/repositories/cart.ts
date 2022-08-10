import { EntityRepository, Repository } from "typeorm"
import { Cart } from "../models"

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {}
