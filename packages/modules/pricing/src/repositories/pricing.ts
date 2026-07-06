import {
  flattenObjectToKeyValuePairs,
  isPresent,
  MedusaError,
  MikroOrmBase,
  normalizeCurrencyCode,
  PriceListStatus,
} from "@medusajs/framework/utils"

import {
  Knex,
  SqlEntityManager,
} from "@medusajs/framework/mikro-orm/postgresql"
import {
  CalculatedPriceSetDTO,
  Context,
  PricingContext,
  PricingFilters,
  PricingRepositoryService,
} from "@medusajs/framework/types"

export class PricingRepository
  extends MikroOrmBase
  implements PricingRepositoryService
{
  #availableAttributes: Set<string> = new Set()

  constructor() {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
  }

  clearAvailableAttributes() {
    this.#availableAttributes.clear()
  }

  async #cacheAvailableAttributes() {
    const manager = this.getActiveManager<SqlEntityManager>()
    const knex = manager.getKnex()

    const { rows } = await knex.raw(
      `
      SELECT DISTINCT attribute 
      FROM (
        SELECT attribute 
        FROM price_rule 
        UNION ALL
        SELECT attribute 
        FROM price_list_rule
      ) as combined_rules_attributes
    `
    )
    this.#availableAttributes.clear()
    rows.forEach(({ attribute }: { attribute: string }) => {
      this.#availableAttributes.add(attribute)
    })
  }

  async #cacheAvailableAttributesIfNecessary() {
    if (this.#availableAttributes.size === 0) {
      await this.#cacheAvailableAttributes()
    }
  }

  async calculatePrices(
    pricingFilters: PricingFilters,
    pricingContext: PricingContext = { context: {} },
    sharedContext: Context = {}
  ): Promise<CalculatedPriceSetDTO[]> {
    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    const knex = manager.getKnex()
    const context = { ...(pricingContext.context || {}) }

    // Extract quantity and currency from context
    const quantity = context.quantity as number | undefined
    delete context.quantity

    // Currency code is required
    const currencyCode = context.currency_code as string | undefined
    delete context.currency_code

    if (!currencyCode) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Method calculatePrices requires currency_code in the pricing context`
      )
    }

    // Generate flatten key-value pairs for rule matching
    const flattenedKeyValuePairs = flattenObjectToKeyValuePairs(context)

    // First filter by value presence
    let flattenedContext = Object.entries(flattenedKeyValuePairs).filter(
      ([, value]) => {
        const isValuePresent = !Array.isArray(value) && isPresent(value)
        const isArrayPresent = Array.isArray(value) && value.flat(1).length

        return isValuePresent || isArrayPresent
      }
    )

    if (flattenedContext.length > 10) {
      await this.#cacheAvailableAttributesIfNecessary()
      flattenedContext = flattenedContext.filter(([key]) =>
        this.#availableAttributes.has(key)
      )
    }

    const hasComplexContext = flattenedContext.length > 0

    const query = knex
      .select({
        id: "price.id",
        price_set_id: "price.price_set_id",
        amount: "price.amount",
        raw_amount: "price.raw_amount",
        min_quantity: "price.min_quantity",
        max_quantity: "price.max_quantity",
        currency_code: "price.currency_code",
        price_list_id: "price.price_list_id",
        price_list_type: "pl.type",
        rules_count: "price.rules_count",
        price_list_rules_count: "pl.rules_count",
      })
      .from("price")
      .whereIn("price.price_set_id", pricingFilters.id)
      .andWhere(
        "price.currency_code",
        normalizeCurrencyCode(currencyCode ?? "")
      )
      .whereNull("price.deleted_at")

    if (quantity !== undefined) {
      query.andWhere(function (this: Knex.QueryBuilder) {
        this.orWhere(function (this: Knex.QueryBuilder) {
          this.where("price.min_quantity", "<=", quantity).andWhere(
            "price.max_quantity",
            ">=",
            quantity
          )

          this.orWhere("price.min_quantity", "<=", quantity).whereNull(
            "price.max_quantity"
          )

          this.orWhereNull("price.min_quantity").whereNull("price.max_quantity")

          this.orWhereNull("price.min_quantity").andWhere(
            "price.max_quantity",
            ">=",
            quantity
          )
        })
      })
    } else {
      query.andWhere(function (this: Knex.QueryBuilder) {
        this.where("price.min_quantity", "<=", 1).orWhereNull(
          "price.min_quantity"
        )
      })
    }

    query.leftJoin("price_list as pl", function (this: Knex.JoinClause) {
      this.on("pl.id", "=", "price.price_list_id")
        .andOn("pl.status", "=", knex.raw("?", [PriceListStatus.ACTIVE]))
        .andOn(function (this: Knex.JoinClause) {
          this.onNull("pl.deleted_at")
        })
        .andOn(function (this: Knex.JoinClause) {
          this.onNull("pl.starts_at").orOn("pl.starts_at", "<=", knex.fn.now())
        })
        .andOn(function (this: Knex.JoinClause) {
          this.onNull("pl.ends_at").orOn("pl.ends_at", ">=", knex.fn.now())
        })
    })

    if (hasComplexContext) {
      // Build match conditions for LATERAL join
      const priceRuleMatchConditions = flattenedContext
        .map(([_key, value]) => {
          if (typeof value === "number") {
            return `
              (pr.attribute = ? AND (
                (pr.operator = 'eq' AND pr.value = ?) OR
                (pr.operator = 'gt' AND ? > pr.value::numeric) OR
                (pr.operator = 'gte' AND ? >= pr.value::numeric) OR
                (pr.operator = 'lt' AND ? < pr.value::numeric) OR
                (pr.operator = 'lte' AND ? <= pr.value::numeric)
              ))
            `
          } else {
            const normalizeValue = Array.isArray(value) ? value : [value]
            const placeholders = normalizeValue.map(() => "?").join(",")
            return `(pr.attribute = ? AND pr.value IN (${placeholders}))`
          }
        })
        .join(" OR ")

      const priceRuleMatchParams = flattenedContext.flatMap(([key, value]) => {
        if (typeof value === "number") {
          return [key, value.toString(), value, value, value, value]
        } else {
          const normalizeValue = Array.isArray(value) ? value : [value]
          return [key, ...normalizeValue]
        }
      })

      const priceListRuleMatchConditions = flattenedContext
        .map(([_key, value]) => {
          if (Array.isArray(value)) {
            return value
              .map((_v) => `(plr.attribute = ? AND plr.value @> ?)`)
              .join(" OR ")
          }
          return `(plr.attribute = ? AND plr.value @> ?)`
        })
        .join(" OR ")

      const priceListRuleMatchParams = flattenedContext.flatMap(
        ([key, value]) => {
          const valueAsArray = Array.isArray(value) ? value : [value]
          return valueAsArray.flatMap((v) => [key, JSON.stringify(v)])
        }
      )

      // Use LATERAL joins to compute matched and total counts in one go
      query
        .leftJoin(
          knex.raw(
            `LATERAL (
            SELECT
              COUNT(*) FILTER (WHERE ${priceRuleMatchConditions}) as matched_count,
              COUNT(*) as total_count
            FROM price_rule pr
            WHERE pr.price_id = price.id
              AND pr.deleted_at IS NULL
          ) pr_stats`,
            priceRuleMatchParams
          ),
          knex.raw("true")
        )
        .leftJoin(
          knex.raw(
            `LATERAL (
            SELECT
              COUNT(*) FILTER (WHERE ${priceListRuleMatchConditions}) as matched_count,
              COUNT(*) as total_count
            FROM price_list_rule plr
            WHERE plr.price_list_id = pl.id
              AND plr.deleted_at IS NULL
          ) plr_stats`,
            priceListRuleMatchParams
          ),
          knex.raw("true")
        )

      query.where((qb) => {
        qb.where((qb2) => {
          // No price list: price rules must match or be zero
          qb2.whereNull("price.price_list_id").andWhere((qb3) => {
            qb3
              .where("price.rules_count", 0)
              .orWhereRaw("pr_stats.matched_count = price.rules_count")
          })
        }).orWhere((qb2) => {
          // Has price list: both price rules and price list rules must match
          qb2
            .whereNotNull("price.price_list_id")
            .andWhere((qb3) => {
              qb3
                .where("price.rules_count", 0)
                .orWhereRaw("pr_stats.matched_count = price.rules_count")
            })
            .andWhere((qb3) => {
              qb3
                .where("pl.rules_count", 0)
                .orWhereRaw("plr_stats.matched_count = pl.rules_count")
            })
        })
      })
    } else {
      query.where(function (this: Knex.QueryBuilder) {
        this.where(function (this: Knex.QueryBuilder) {
          this.whereNull("price.price_list_id").where("price.rules_count", 0)
        }).orWhere(function (this: Knex.QueryBuilder) {
          this.whereNotNull("price.price_list_id").where("price.rules_count", 0).where("pl.rules_count", 0)
        })
      })
    }

    query
      .orderByRaw("price.price_list_id IS NOT NULL DESC")
      .orderByRaw("price.rules_count + COALESCE(pl.rules_count, 0) DESC")
      .orderBy("price.amount", "asc")

    return await query
  }
}
