import partition from "lodash/partition"
import { MedusaError } from "medusa-core-utils"
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

  public async findManyForVariantInRegion(
    variant_id: string,
    region_id?: string,
    currency_code?: string,
    customer_id?: string,
    includeDiscountPrices?: boolean
  ): Promise<MoneyAmount[]> {
    const date = new Date()

    let qb = this.createQueryBuilder("ma")
      .where("ma.variant_id = :variant_id", { variant_id: variant_id })
      .andWhere("(ma.ends_at is null OR ma.ends_at > :date) ", {
        date: date.toUTCString(),
      })
      .andWhere("(ma.starts_at is null OR ma.starts_at < :date)", {
        date: date.toUTCString(),
      })

    if (region_id || currency_code) {
      qb = qb.andWhere(
        "(ma.region_id = :region_id OR ma.currency_code = :currency_code)",
        {
          region_id: region_id,
          currency_code: currency_code,
        }
      )
    } else if (!customer_id && !includeDiscountPrices) {
      qb = qb.andWhere("ma.type = 'default'")
    }

    if (customer_id) {
      qb = qb
        .leftJoinAndSelect("ma.customer_groups", "cgroup")
        .leftJoinAndSelect(
          "customer_group_customers",
          "cgc",
          "cgc.customer_group_id = cgroup.id"
        )
        .andWhere("(cgc is null OR cgc.customer_id = :customer_id)", {
          customer_id,
        })
    } else {
      qb = qb
        .leftJoinAndSelect("ma.customer_groups", "cgroup")
        .andWhere("cgroup is null")
    }
    return await qb.getMany()
  }
}
