import { EntityRepository, Repository } from "typeorm"
import { LineItem } from "../models/line-item"

@EntityRepository(LineItem)
export class LineItemRepository extends Repository<LineItem> {}
