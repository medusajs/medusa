import partition from "lodash/partition"
import {
  Brackets,
  In,
  IsNull,
  Not,
  ObjectLiteral,
  WhereExpressionBuilder,
} from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { dataSource } from "../loaders/database"
import { MoneyAmount } from "../models"
import {
  PriceListPriceCreateInput,
  PriceListPriceUpdateInput,
} from "../types/price-list"
import { ProductVariantPrice } from "../types/product-variant"
import { isString } from "../utils"

type Price = Partial<
  Omit<MoneyAmount, "created_at" | "updated_at" | "deleted_at">
> & {
  amount: number
}

export const MoneyAmountRepository = dataSource
  .getRepository(MoneyAmount)
  .extend({
    async insertBulk(
      data: QueryDeepPartialEntity<MoneyAmount>[]
    ): Promise<MoneyAmount[]> {
      const queryBuilder = this.createQueryBuilder()
        .insert()
        .into(MoneyAmount)
        .values(data)

      // TODO: remove if statement once this issue is resolved https://github.com/typeorm/typeorm/issues/9850
      if (!queryBuilder.connection.driver.isReturningSqlSupported("insert")) {
        const rawMoneyAmounts = await queryBuilder.execute()
        return rawMoneyAmounts.generatedMaps.map((d) =>
          this.create(d)
        ) as MoneyAmount[]
      }

      const rawMoneyAmounts = await queryBuilder.returning("*").execute()
      return rawMoneyAmounts.generatedMaps.map((d) => this.create(d))
    },

    /**
     * Will be removed in a future release.
     * Use `deleteVariantPricesNotIn` instead.
     * @deprecated
     */
    async findVariantPricesNotIn(
      variantId: string,
      prices: Price[]
    ): Promise<MoneyAmount[]> {
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
    },

    async deleteVariantPricesNotIn(
      variantIdOrData:
        | string
        | { variantId: string; prices: ProductVariantPrice[] }[],
      prices?: Price[]
    ): Promise<void> {
      const data = isString(variantIdOrData)
        ? [
            {
              variantId: variantIdOrData,
              prices: prices!,
            },
          ]
        : variantIdOrData

      const queryBuilder = this.createQueryBuilder().delete()

      for (const data_ of data) {
        const where = {
          variant_id: data_.variantId,
          price_list_id: IsNull(),
        }

        const orWhere: ObjectLiteral[] = []

        for (const price of data_.prices) {
          if (price.currency_code) {
            orWhere.push(
              {
                currency_code: Not(price.currency_code),
              },
              {
                region_id: price.region_id
                  ? Not(price.region_id)
                  : Not(IsNull()),
                currency_code: price.currency_code,
              }
            )
          }

          if (price.region_id) {
            orWhere.push({
              region_id: Not(price.region_id),
            })
          }
        }

        queryBuilder.orWhere(
          new Brackets((localQueryBuild) => {
            localQueryBuild.where(where).andWhere(orWhere)
          })
        )
      }

      await queryBuilder.execute()
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
          new Brackets((qb) => {
            if (region_id && !currency_code) {
              qb.where({ region_id: region_id })
            }
            if (!region_id && currency_code) {
              qb.where({ currency_code: currency_code })
            }
            if (currency_code && region_id) {
              qb.where({ region_id: region_id }).orWhere({
                currency_code: currency_code,
              })
            }
          })
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
