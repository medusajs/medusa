import { EntityRepository, Repository } from "typeorm"
import { Product } from "../models/product"

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}
