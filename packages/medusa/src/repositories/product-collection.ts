import { EntityRepository, Repository } from "typeorm"
import { ProductCollection } from "../models/product-collection"

@EntityRepository(ProductCollection)
// eslint-disable-next-line max-len
export class ProductCollectionRepository extends Repository<ProductCollection> {}
