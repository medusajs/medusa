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
import { PriceListPriceCreateInput, PriceListPriceUpdateInput } from "../types/price-list"

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
        price_list_id: IsNull(),
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

  public async upsertVariantCurrencyPrice(variantId: string, price: Price) {
    let moneyAmount = await this.findOne({
      where: {
        currency_code: price.currency_code,
        variant_id: variantId,
        region_id: IsNull(),
        price_list_id: IsNull(),
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

  public async addPriceListPrices(
    priceListId: string,
    prices: PriceListPriceCreateInput[],
    overrideExisting: boolean = false
  ): Promise<MoneyAmount[]> {
    const toInsert = prices.map((price) => (this.create({
      ...price,
      price_list_id: priceListId,
    })))
    const insertResult = await this.createQueryBuilder()
      .insert()
      .orIgnore(true)
      .into(MoneyAmount)
      .values(toInsert)
      .execute()

    if (overrideExisting) {
      await this.createQueryBuilder()
        .delete()
        .from(MoneyAmount)
        .where({
          price_list_id: priceListId,
          id: Not(In(insertResult.identifiers.map((ma) => ma.id))),
        })
        .execute()
    }

    return await this.manager
      .createQueryBuilder(MoneyAmount, "ma")
      .select()
      .where(insertResult.identifiers)
      .getMany()
  }

  public async deletePriceListPrices(
    priceListId: string,
    moneyAmountIds: string[]
  ): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from(MoneyAmount)
      .where({ price_list_id: priceListId, id: In(moneyAmountIds) })
      .execute()
  }

  public async updatePriceListPrices(
    priceListId: string,
    updates: PriceListPriceUpdateInput[]
  ): Promise<MoneyAmount[]> {
    const [existingPrices, newPrices] = partition(updates, (update) => update.id)

    const newPriceEntities = newPrices.map((price) => (this.create({ ...price, price_list_id: priceListId })))

    return await this.save([...existingPrices, ...newPriceEntities])
  }
}
