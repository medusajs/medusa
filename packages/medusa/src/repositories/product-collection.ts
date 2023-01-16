import { EntityRepository, Repository } from "typeorm"
import { ProductCollection } from "../models"
import { ExtendedFindConfig, Selector } from "../types/common"

@EntityRepository(ProductCollection)
// eslint-disable-next-line max-len
export class ProductCollectionRepository extends Repository<ProductCollection> {}
