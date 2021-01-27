import { EntityRepository, Repository } from "typeorm"
import { ProductCategory } from "../models/product-category"

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends Repository<ProductCategory> {}
