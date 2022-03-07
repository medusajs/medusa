import partition from "lodash/partition"
import {
  Brackets,
  EntityRepository,
  In,
  IsNull,
  Not,
  Repository
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

  public async bulkAddOrUpdate(variantId: string, prices: Price[]) {
    const [toUpdate, toCreate] = partition(prices, (p) => p.id)
    const createdEntities = toCreate.map((tc) => {
      return this.create({ ...tc, variant_id: variantId })
    })

    const existing = await this.findByIds(toUpdate.map((tu) => tu.id))

    const updatedEntities: Partial<MoneyAmount>[] = existing.map((e) => {
      const update = toUpdate.find((update) => update.id === e.id)
      return {
        ...e,
        ...update,
      }
    })

    await this.save([...updatedEntities, ...createdEntities])
  }

  public async bulkDelete(variantId: string, moneyAmountIds: string[]) {
    await this.createQueryBuilder()
      .delete()
      .from(MoneyAmount)
      .where({ variant_id: variantId, id: In(moneyAmountIds) })
      .execute()
  }
}
