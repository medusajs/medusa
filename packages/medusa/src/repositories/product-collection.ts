import { EntityRepository, Repository } from "typeorm"
import { ProductCollection } from "../models/product-collection"

@EntityRepository(ProductCollection)
export class ProductCollectionRepository extends Repository<
  ProductCollection
> {}
