import { EntityRepository, Repository } from "typeorm"
import { GiftCardTransaction } from "../models/gift-card-transaction"

@EntityRepository(GiftCardTransaction)
// eslint-disable-next-line max-len
export class GiftCardTransactionRepository extends Repository<GiftCardTransaction> {}
