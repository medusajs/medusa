import { EntityRepository, Repository } from "typeorm"
import { ProductOptionValue } from "../models/product-option-value"

@EntityRepository(ProductOptionValue)
// eslint-disable-next-line max-len
export class ProductOptionValueRepository extends Repository<ProductOptionValue> {}
