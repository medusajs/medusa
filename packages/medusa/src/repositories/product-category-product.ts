import { EntityRepository, Repository } from "typeorm"
import { ProductCategoryProduct } from "../models"

@EntityRepository(ProductCategoryProduct)
// eslint-disable-next-line max-len
export class ProductCategoryProductRepository extends Repository<ProductCategoryProduct> {}
