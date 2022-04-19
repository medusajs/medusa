import { EntityRepository, Repository } from "typeorm"
import { LineItemAdjustment } from "../models/line-item-adjustment"

@EntityRepository(LineItemAdjustment)
export class LineItemAdjustmentRepository extends Repository<LineItemAdjustment> {}

