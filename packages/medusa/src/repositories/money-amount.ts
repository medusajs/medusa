import {
  Brackets,
  EntityRepository,
  In,
  IsNull,
  Not,
  Repository,
} from "typeorm"
import { MoneyAmount } from "../models/money-amount"

type Price = Partial<
  Omit<MoneyAmount, "created_at" | "updated_at" | "deleted_at">
> & {
  amount: number
}

@EntityRepository(MoneyAmount)
export class MoneyAmountRepository extends Repository<MoneyAmount> {
  public async findVariantPricesNotIn(variantId: string, prices: Price[]) {
    const pricesNotInPricesPayload = await this.createQueryBuilder()
      .where({
        variant_id: variantId,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where({
            currency_code: Not(In(prices.map((p) => p.currency_code))),
          }).orWhere({ region_id: Not(In(prices.map((p) => p.region_id))) })
        })
      )
      .getMany()
    return pricesNotInPricesPayload
  }

  public async upsertCurrencyPrice(variantId: string, price: Price) {
    let moneyAmount = await this.findOne({
      where: {
        currency_code: price.currency_code,
        variant_id: variantId,
        region_id: IsNull(),
      },
    })

    if (!moneyAmount) {
      moneyAmount = this.create({
        ...price,
        currency_code: price.currency_code?.toLowerCase(),
        variant_id: variantId,
      })
    } else {
      moneyAmount.amount = price.amount
    }

    return await this.save(moneyAmount)
  }

  public async bulkValidateIds(ids: string[]) {
    const moneyAmounts = await this.find({
      where: {
        id: In(ids),
      },
      select: ["id"],
    })

    return moneyAmounts.map((moneyAmount) => moneyAmount.id)
  }

  public async bulkDelete(moneyAmountIds: string[], variantId: string) {
    await this.createQueryBuilder()
      .delete()
      .from(MoneyAmount)
      .where({ id: In(moneyAmountIds), variant_id: variantId })
      .execute()
  }
}
