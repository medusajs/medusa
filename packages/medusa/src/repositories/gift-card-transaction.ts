import { EntityRepository, Repository } from "typeorm"
import { GiftCardTransaction } from "../models/gift-card-transaction"

@EntityRepository(GiftCardTransaction)
export class GiftCardTransactionRepository extends Repository<
  GiftCardTransaction
> {}
