import { EntityRepository, Repository } from "typeorm"
import { GiftCard } from "../models/gift-card"

@EntityRepository(GiftCard)
export class GiftCardRepository extends Repository<GiftCard> {}
