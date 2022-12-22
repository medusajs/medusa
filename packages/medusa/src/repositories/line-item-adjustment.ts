import { EntityRepository, Repository } from "typeorm"
import { LineItemAdjustment } from "../models/line-item-adjustment"

@EntityRepository(LineItemAdjustment)
// eslint-disable-next-line max-len
export class LineItemAdjustmentRepository extends Repository<LineItemAdjustment> {}
