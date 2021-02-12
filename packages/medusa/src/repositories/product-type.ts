import { EntityRepository, Repository } from "typeorm"
import { ProductType } from "../models/product-type"

@EntityRepository(ProductType)
export class ProductTypeRepository extends Repository<ProductType> {}
