import {
  CalculatedPriceSetDTO,
  Context,
  PricingContext,
  PricingFilters,
} from "@medusajs/types"
import { MedusaError, MikroOrmBase } from "@medusajs/utils"

import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PricingRepositoryService } from "../types"

export class PricingRepository
  extends MikroOrmBase
  implements PricingRepositoryService
{
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.manager_ = manager
  }

  async calculatePrices(
    pricingFilters: PricingFilters,
    pricingContext: PricingContext = { context: {} },
    sharedContext: Context = {}
  ): Promise<CalculatedPriceSetDTO[]> {
    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    const knex = manager.getKnex()
    const context = pricingContext.context || {}

    // Quantity is used to scope money amounts based on min_quantity and max_quantity.
    // We should potentially think of reserved words in pricingContext that can't be used in rules
    // or have a separate pricing options that accept things like quantity, price_list_id and other
    // pricing module features
    const quantity = context.quantity
    delete context.quantity

    // Currency code here is a required param.
    const currencyCode = context.currency_code
    delete context.currency_code

    if (!currencyCode) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Method calculatePrices requires currency_code in the pricing context`
      )
    }

    const isContextPresent = Object.entries(context).length || !!currencyCode

    // Only if the context is present do we need to query the database.
    // We don't get anything from the db otherwise.
    if (!isContextPresent) {
      return []
    }

    const date = new Date().toISOString()
    // Gets all the price set money amounts where rules match for each of the contexts
    // that the price set is configured for
    const psmaSubQueryKnex = knex({
      psma: "price_set_money_amount",
    })
      .select({
        id: "psma1.id",
        price_set_id: "psma1.price_set_id",
        money_amount_id: "psma1.money_amount_id",
        rules_count: "psma1.rules_count",
        price_list_id: "psma1.price_list_id",
        pl_rules_count: "pl.rules_count",
        pl_type: "pl.type",
        has_price_list: knex.raw(
          "case when psma1.price_list_id IS NULL then False else True end"
        ),
      })
      .leftJoin("price_set_money_amount as psma1", "psma1.id", "psma1.id")
      .leftJoin("price_rule as pr", "pr.price_set_money_amount_id", "psma1.id")
      .leftJoin("price_list as pl", "pl.id", "psma1.price_list_id")
      .leftJoin("price_list_rule as plr", "plr.price_list_id", "pl.id")
      .leftJoin(
        "price_list_rule_value as plrv",
        "plrv.price_list_rule_id",
        "plr.id"
      )
      .leftJoin("rule_type as plrt", "plrt.id", "plr.rule_type_id")
      .leftJoin("rule_type as rt", "rt.id", "pr.rule_type_id")
      .orderBy([
        { column: "rules_count", order: "desc" },
        { column: "pl.rules_count", order: "desc" },
      ])
      .groupBy("psma1.id", "pl.id")
      .having(
        knex.raw(
          "count(DISTINCT rt.rule_attribute) = psma1.rules_count AND psma1.price_list_id IS NULL"
        )
      )
      .orHaving(
        knex.raw(
          "count(DISTINCT plrt.rule_attribute) = pl.rules_count AND psma1.price_list_id IS NOT NULL"
        )
      )

    psmaSubQueryKnex.orWhere((q) => {
      for (const [key, value] of Object.entries(context)) {
        q.orWhere({
          "rt.rule_attribute": key,
          "pr.value": value,
        })
      }
      q.orWhere("psma1.rules_count", "=", 0)
      q.whereNull("psma1.price_list_id")
    })

    psmaSubQueryKnex.orWhere((q) => {
      q.whereNotNull("psma1.price_list_id")
        .andWhere(function () {
          this.whereNull("pl.starts_at").orWhere("pl.starts_at", "<=", date)
        })
        .andWhere(function () {
          this.whereNull("pl.ends_at").orWhere("pl.ends_at", ">=", date)
        })
        .andWhere(function () {
          this.andWhere(function () {
            for (const [key, value] of Object.entries(context)) {
              this.orWhere({
                "plrt.rule_attribute": key,
              })
              this.whereIn("plrv.value", [value])
            }

            this.orWhere("pl.rules_count", "=", 0)
          })

          this.andWhere(function () {
            this.andWhere(function () {
              for (const [key, value] of Object.entries(context)) {
                this.orWhere({
                  "rt.rule_attribute": key,
                  "pr.value": value,
                })
              }
              this.andWhere("psma1.rules_count", ">", 0)
            })
            this.orWhere("psma1.rules_count", "=", 0)
          })
        })
    })

    const priceSetQueryKnex = knex({
      ps: "price_set",
    })
      .select({
        id: "ma.id",
        price_set_id: "ps.id",
        amount: "ma.amount",
        min_quantity: "ma.min_quantity",
        max_quantity: "ma.max_quantity",
        currency_code: "ma.currency_code",
        default_priority: "rt.default_priority",
        rules_count: "psma.rules_count",
        pl_rules_count: "psma.pl_rules_count",
        price_list_type: "psma.pl_type",
        price_list_id: "psma.price_list_id",
      })
      .join(psmaSubQueryKnex.as("psma"), "psma.price_set_id", "ps.id")
      .join("money_amount as ma", "ma.id", "psma.money_amount_id")
      .leftJoin("price_rule as pr", "pr.price_set_money_amount_id", "psma.id")
      .leftJoin("rule_type as rt", "rt.id", "pr.rule_type_id")
      .whereIn("ps.id", pricingFilters.id)
      .andWhere("ma.currency_code", "=", currencyCode)

      .orderBy([
        { column: "psma.has_price_list", order: "asc" },
        { column: "amount", order: "asc" },
        { column: "rules_count", order: "desc" },
        { column: "default_priority", order: "desc" },
      ])

    if (quantity) {
      priceSetQueryKnex.where("ma.min_quantity", "<=", quantity)
      priceSetQueryKnex.andWhere("ma.max_quantity", ">=", quantity)
    } else {
      priceSetQueryKnex.andWhere(function () {
        this.andWhere("ma.min_quantity", "<=", "1").orWhereNull(
          "ma.min_quantity"
        )
      })
    }

    return await priceSetQueryKnex
  }
}
