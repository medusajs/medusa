import { EntityRepository, Repository } from "typeorm"
import { ProductOption } from "../models/product-option"

@EntityRepository(ProductOption)
export class ProductOptionRepository extends Repository<ProductOption> {}
