import { EntityRepository, Repository } from "typeorm"
import { Currency } from "../models"

@EntityRepository(Currency)
export class CurrencyRepository extends Repository<Currency> {}
