import partition from "lodash/partition"
import {
  Brackets,
  EntityRepository,
  In,
  IsNull,
  LessThan,
  MoreThan,
  Not,
  Repository,
} from "typeorm"
import { Writable } from "typeorm/platform/PlatformTools"
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

  public async findDefaultForVariantInRegion(
    variant_id: string,
    region_id: string,
    currency_code: string
  ): Promise<MoneyAmount | undefined> {
    return await this.createQueryBuilder("ma")
      .where({ type: "default", variant_id })
      .andWhere((qb) => qb.where({ region_id }).orWhere({ currency_code }))
      .getOne()
  }

  public async findManyForVariantInRegion(
    variant_id: string,
    region_id: string,
    currency_code: string,
    customer_id?: string
  ): Promise<MoneyAmount[]> {
    const date = new Date()

    let qb = this.createQueryBuilder("ma")
      .where({ variant_id })
      .andWhere((qb) => qb.where({ region_id }).orWhere({ currency_code }))
      .andWhere((qb) =>
        qb
          .where({ ends_at: MoreThan(date), starts_at: LessThan(date) })
          .orWhere({ ends_at: null, starts_at: null })
      )

    if (customer_id) {
      qb = qb.leftJoinAndSelect("ma.customer_groups", "cGroup").andWhere((qb) =>
        qb
          .where("cGroup.customer_id = :customer_id", {
            customer_id,
          })
          .orWhere({ cGroup: null })
      )
    } else {
      qb = qb
        .loadRelationCountAndMap("repo_group_count", "customer_groups")
        .andWhere({ repo_group_count: 0 }) // .andWhere("cGroup.customer_group_id IN (:...customer_group_ids)", {
    }
    return await qb.getMany()
  }
}
