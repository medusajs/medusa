import partition from "lodash/partition"
import { Brackets, In, IsNull, Not, WhereExpressionBuilder } from "typeorm"
import { MoneyAmount } from "../models/money-amount"
import {
  PriceListPriceCreateInput,
  PriceListPriceUpdateInput,
} from "../types/price-list"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { dataSource } from "../loaders/database"

type Price = Partial<
  Omit<MoneyAmount, "created_at" | "updated_at" | "deleted_at">
> & {
  amount: number
}

export const MoneyAmountRepository = dataSource
  .getRepository(MoneyAmount)
  .extend({
    async findVariantPricesNotIn(
      variantId: string,
      prices: Price[]
    ): Promise<MoneyAmount[]> {
      const notInCurrencyCode = prices.map((p) => p.currency_code)
      const notInRegion = prices.map((p) => p.region_id)

      return await this.find({
        where: [
          {
            variant_id: variantId,
            price_list_id: IsNull(),
            currency_code: Not(In(notInCurrencyCode)),
          },
          {
            variant_id: variantId,
            price_list_id: IsNull(),
            region_id: Not(In(notInRegion)),
          },
        ],
      })
    },

    async upsertVariantCurrencyPrice(
      variantId: string,
      price: Price
    ): Promise<MoneyAmount> {
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
    },

    async addPriceListPrices(
      priceListId: string,
      prices: PriceListPriceCreateInput[],
      overrideExisting = false
    ): Promise<MoneyAmount[]> {
      const toInsert = prices.map((price) =>
        this.create({
          ...price,
          price_list_id: priceListId,
        })
      )

      const insertResult = await this.createQueryBuilder()
        .insert()
        .orIgnore(true)
        .into(MoneyAmount)
        .values(toInsert as QueryDeepPartialEntity<MoneyAmount>[])
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
    },

    async deletePriceListPrices(
      priceListId: string,
      moneyAmountIds: string[]
    ): Promise<void> {
      await this.createQueryBuilder()
        .delete()
        .from(MoneyAmount)
        .where({ price_list_id: priceListId, id: In(moneyAmountIds) })
        .execute()
    },

    async findManyForVariantInPriceList(
      variant_id: string,
      price_list_id: string,
      requiresPriceList = false
    ): Promise<[MoneyAmount[], number]> {
      const qb = this.createQueryBuilder("ma")
        .leftJoinAndSelect("ma.price_list", "price_list")
        .where("ma.variant_id = :variant_id", { variant_id })

      const getAndWhere = (subQb): WhereExpressionBuilder => {
        const andWhere = subQb.where("ma.price_list_id = :price_list_id", {
          price_list_id,
        })
        if (!requiresPriceList) {
          andWhere.orWhere("ma.price_list_id IS NULL")
        }
        return andWhere
      }

      qb.andWhere(new Brackets(getAndWhere))

      return await qb.getManyAndCount()
    },

    async findManyForVariantInRegion(
      variant_id: string,
      region_id?: string,
      currency_code?: string,
      customer_id?: string,
      include_discount_prices?: boolean,
      include_tax_inclusive_pricing = false
    ): Promise<[MoneyAmount[], number]> {
      const date = new Date()

      const qb = this.createQueryBuilder("ma")
        .leftJoinAndSelect("ma.price_list", "price_list")
        .where({ variant_id: variant_id })
        .andWhere("(ma.price_list_id is null or price_list.status = 'active')")
        .andWhere(
          "(price_list.ends_at is null OR price_list.ends_at > :date)",
          {
            date: date.toUTCString(),
          }
        )
        .andWhere(
          "(price_list.starts_at is null OR price_list.starts_at < :date)",
          {
            date: date.toUTCString(),
          }
        )

      if (include_tax_inclusive_pricing) {
        qb.leftJoin("ma.currency", "currency")
          .leftJoin("ma.region", "region")
          .addSelect(["currency.includes_tax", "region.includes_tax"])
      }
      if (region_id || currency_code) {
        qb.andWhere(
          new Brackets((qb) =>
            qb
              .where({ region_id: region_id })
              .orWhere({ currency_code: currency_code })
          )
        )
      } else if (!customer_id && !include_discount_prices) {
        qb.andWhere("price_list.id IS null")
      }

      if (customer_id) {
        qb.leftJoin("price_list.customer_groups", "cgroup")
          .leftJoin(
            "customer_group_customers",
            "cgc",
            "cgc.customer_group_id = cgroup.id"
          )
          .andWhere(
            "(cgc.customer_group_id is null OR cgc.customer_id = :customer_id)",
            {
              customer_id,
            }
          )
      } else {
        qb.leftJoin("price_list.customer_groups", "cgroup").andWhere(
          "cgroup.id is null"
        )
      }
      return await qb.getManyAndCount()
    },

    async updatePriceListPrices(
      priceListId: string,
      updates: PriceListPriceUpdateInput[]
    ): Promise<MoneyAmount[]> {
      const [existingPrices, newPrices] = partition(
        updates,
        (update) => update.id
      )

      const newPriceEntities = newPrices.map((price) =>
        this.create({ ...price, price_list_id: priceListId })
      )

      return await this.save([...existingPrices, ...newPriceEntities])
    },
  })
export default MoneyAmountRepository
