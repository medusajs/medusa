import { EntityRepository, Repository } from "typeorm"
import { ProductCollection } from "../models"

@EntityRepository(ProductCollection)
export class ProductCollectionRepository extends Repository<ProductCollection> {}
