import { EntityRepository, Repository } from "typeorm"
import { Currency } from "../models/currency"

@EntityRepository(Currency)
export class CurrencyRepository extends Repository<Currency> { }
