import { EntityRepository, Repository } from "typeorm"
import { TaxLine } from "../models/tax-line"

@EntityRepository(TaxLine)
export class TaxLineRepository extends Repository<TaxLine> {}
