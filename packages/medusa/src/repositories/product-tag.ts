import { EntityRepository, Repository } from "typeorm"
import { ProductTag } from "../models/product-tag"

@EntityRepository(ProductTag)
export class ProductTagRepository extends Repository<ProductTag> {}
