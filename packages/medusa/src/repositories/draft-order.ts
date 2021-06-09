import { EntityRepository, Repository } from "typeorm"
import { DraftOrder } from "../models/draft-order"

@EntityRepository(DraftOrder)
export class DraftOrderRepository extends Repository<DraftOrder> {}
