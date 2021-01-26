import { EntityRepository, Repository } from "typeorm"
import { ReturnItem } from "../models/return-item"

@EntityRepository(ReturnItem)
export class ReturnItemRepository extends Repository<ReturnItem> {}
