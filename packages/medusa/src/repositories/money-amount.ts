import { EntityRepository, Repository } from "typeorm"
import { MoneyAmount } from "../models/money-amount"

@EntityRepository(MoneyAmount)
export class MoneyAmountRepository extends Repository<MoneyAmount> { }
