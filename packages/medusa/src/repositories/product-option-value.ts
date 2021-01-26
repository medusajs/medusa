import { EntityRepository, Repository } from "typeorm"
import { ProductOptionValue } from "../models/product-option-value"

@EntityRepository(ProductOptionValue)
export class ProductOptionValueRepository extends Repository<ProductOptionValue> { }
