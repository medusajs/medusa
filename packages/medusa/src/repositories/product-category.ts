import { EntityRepository, TreeRepository } from "typeorm"
import { ProductCategory } from "../models/product-category"

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {}
