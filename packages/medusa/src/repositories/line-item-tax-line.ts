import { EntityRepository, Repository } from "typeorm"
import { LineItemTaxLine } from "../models/line-item-tax-line"

@EntityRepository(LineItemTaxLine)
export class LineItemTaxLineRepository extends Repository<LineItemTaxLine> {}
