import { EntityRepository, Repository } from "typeorm"
import { ProductVariant } from "../models/product-variant"

@EntityRepository(ProductVariant)
export class ProductVariantRepository extends Repository<ProductVariant> {}
