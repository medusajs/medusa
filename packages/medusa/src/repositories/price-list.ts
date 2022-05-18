import { EntityRepository, Repository } from "typeorm"
import { PriceList } from "../models/price-list"

@EntityRepository(PriceList)
export class PriceListRepository extends Repository<PriceList> {}
