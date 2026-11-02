import {
  ComputeActionContext,
  ComputeActionItemLine,
  ComputeActionShippingLine,
  Context,
  DAL,
  PromotionTypes,
} from "@medusajs/framework/types"
import { flattenObjectToKeyValuePairs } from "@medusajs/framework/utils"
import { raw, SqlEntityManager } from "@mikro-orm/postgresql"

/**
 * Builds a query filter for promotion rules based on the context.
 * This is used to prefilter promotions before computing actions.
 * The idea is that we first retrieve from the database the promotions where all rules can be
 * satisfied by the given context. We exclude promotions that have any rule that cannot be satisfied.
 *
 * @param context
 * @returns
 */
export async function buildPromotionRuleQueryFilterFromContext(
  context: PromotionTypes.ComputeActionContext,
  sharedContext: Context
): Promise<DAL.FilterQuery<any> | null> {
  const {
    items = [],
    shipping_methods: shippingMethods = [],
    ...restContext
  } = context

  let flattenItemsPropsValuesArray = flattenObjectToKeyValuePairs(
    items
  ) as Record<keyof ComputeActionItemLine & string, any>
  flattenItemsPropsValuesArray = Object.fromEntries(
    Object.entries(flattenItemsPropsValuesArray).map(([k, v]) => [
      `items.${k}`,
      v,
    ])
  )

  let flattenShippingMethodsPropsValuesArray = flattenObjectToKeyValuePairs(
    shippingMethods
  ) as Record<keyof ComputeActionShippingLine & string, any>
  flattenShippingMethodsPropsValuesArray = Object.fromEntries(
    Object.entries(flattenShippingMethodsPropsValuesArray).map(([k, v]) => [
      `shipping_methods.${k}`,
      v,
    ])
  )

  const flattenRestContextPropsValuesArray = flattenObjectToKeyValuePairs(
    restContext
  ) as Record<keyof ComputeActionContext & string, any>

  const attributeValueMap = new Map<string, Set<any>>()

  ;[
    flattenItemsPropsValuesArray,
    flattenShippingMethodsPropsValuesArray,
    flattenRestContextPropsValuesArray,
  ].forEach((flattenedArray) => {
    Object.entries(flattenedArray).forEach(([prop, value]) => {
      if (!attributeValueMap.has(prop)) {
        attributeValueMap.set(prop, new Set())
      }

      const values = Array.isArray(value) ? value : [value]
      values.forEach((v) => attributeValueMap.get(prop)!.add(v))
    })
  })

  const numberOfAttributes = attributeValueMap.size
  if (numberOfAttributes > 10) {
    const manager = (sharedContext.transactionManager ??
      sharedContext.manager) as SqlEntityManager
    const knex = manager.getKnex()

    const { rows } = await knex.raw(
      `
        SELECT DISTINCT attribute 
        FROM promotion_rule
        WHERE deleted_at IS NULL
      `
    )

    const dbAvailableAttributes = new Set(
      rows.map(({ attribute }) => attribute)
    )

    // update the attribute in the map to remove the one that are not in the db
    attributeValueMap.forEach((valueSet, attribute) => {
      if (!dbAvailableAttributes.has(attribute)) {
        attributeValueMap.delete(attribute)
      }
    })
  }

  const sqlConditions: string[] = []

  // For each attribute, check if the values don't satisfy the rules
  attributeValueMap.forEach((valueSet, attribute) => {
    const values = Array.from(valueSet)
    const stringValues = values
      .map((v) => `'${v.toString().replace(/'/g, "''")}'`)
      .join(",")

    const numericValues = values
      .map((v) => {
        const num = Number(v)
        return !isNaN(num) ? num : null
      })
      .filter((v) => v !== null) as number[]

    const escapedAttribute = `'${attribute.replace(/'/g, "''")}'`

    // For 'in' and 'eq' operators - rule is unsatisfiable if NO rule values overlap with context
    // This requires checking that ALL rule values for a given rule are not in context
    if (stringValues.length) {
      sqlConditions.push(
        `(pr.attribute = ${escapedAttribute} AND pr.operator IN ('in', 'eq') AND NOT EXISTS (
        SELECT 1
        FROM promotion_rule_value prv_inner
        WHERE prv_inner.promotion_rule_id = pr.id
          AND prv_inner.deleted_at IS NULL
          AND prv_inner.value IN (${stringValues})
      ))`
      )
    }

    if (numericValues.length) {
      const minValue = Math.min(...numericValues)
      const maxValue = Math.max(...numericValues)

      // For gt - rule is unsatisfiable if rule_value >= context_max_value
      sqlConditions.push(
        `(pr.attribute = ${escapedAttribute} AND pr.operator = 'gt' AND CAST(prv.value AS DECIMAL) >= ${maxValue})`
      )

      // For gte - rule is unsatisfiable if rule_value > context_max_value
      sqlConditions.push(
        `(pr.attribute = ${escapedAttribute} AND pr.operator = 'gte' AND prv.value NOT IN (${stringValues}) AND CAST(prv.value AS DECIMAL) > ${maxValue})`
      )

      // For lt - rule is unsatisfiable if rule_value <= context_min_value
      sqlConditions.push(
        `(pr.attribute = ${escapedAttribute} AND pr.operator = 'lt' AND CAST(prv.value AS DECIMAL) <= ${minValue})`
      )

      // For lte - rule is unsatisfiable if rule_value < context_min_value
      sqlConditions.push(
        `(pr.attribute = ${escapedAttribute} AND pr.operator = 'lte' AND prv.value NOT IN (${stringValues}) AND CAST(prv.value AS DECIMAL) < ${minValue})`
      )
    }
  })

  // Handle the case where context has no attributes at all, it means
  // that any promotion that have a rule cant be satisfied by the context
  if (attributeValueMap.size === 0) {
    // If context has no attributes, exclude all promotions that have any rules (promotion rules, target rules, or buy rules)
    return {
      [raw((alias) => excludePromotionsWithRuleMatching(alias, "TRUE"))]: true,
    }
  }

  const joinedConditions = sqlConditions.join(" OR ")
  const queryEstimatedSize = joinedConditions.length
  const maxQuerySize = 2147483648 * 0.9

  if (queryEstimatedSize > maxQuerySize) {
    // generated query could be too long
    return null
  }

  const attributeKeys = Array.from(attributeValueMap.keys())
    .map((attr) => `'${attr.replace(/'/g, "''")}'`)
    .join(",")

  // A promotion is excluded if any of its rules targets an attribute missing
  // from the context, or targets a context attribute with an unsatisfiable value
  const unsatisfiableRule = `(
    pr.attribute NOT IN (${attributeKeys})
    OR (pr.attribute IN (${attributeKeys}) AND (${joinedConditions}))
  )`

  return {
    [raw((alias) =>
      excludePromotionsWithRuleMatching(alias, unsatisfiableRule)
    )]: true,
  }
}

/**
 * Promotion rules can be attached to a promotion in three ways: directly, as
 * target rules of its application method, or as buy rules of its application
 * method.
 */
const RULE_SOURCES = [
  {
    from: `promotion_promotion_rule ppr
      JOIN promotion_rule pr ON ppr.promotion_rule_id = pr.id`,
    promotionId: "ppr.promotion_id",
  },
  {
    from: `promotion_application_method am
      JOIN application_method_target_rules amtr ON am.id = amtr.application_method_id
      JOIN promotion_rule pr ON amtr.promotion_rule_id = pr.id`,
    promotionId: "am.promotion_id",
  },
  {
    from: `promotion_application_method am
      JOIN application_method_buy_rules ambr ON am.id = ambr.application_method_id
      JOIN promotion_rule pr ON ambr.promotion_rule_id = pr.id`,
    promotionId: "am.promotion_id",
  },
]

/**
 * Excludes the promotions having at least one rule, from any source, matching
 * the given condition.
 *
 * Each source gets its own subquery correlated with the outer promotion, so
 * that Postgres can probe the rules of the candidate promotions through the
 * join tables primary keys. An uncorrelated UNION of all sources would instead
 * be materialized with the rules of every promotion on each call, making the
 * cost grow with the total number of promotions rather than with the number of
 * candidates (e.g. only the automatic ones in computeActions).
 */
function excludePromotionsWithRuleMatching(
  alias: string,
  condition: string
): string {
  return RULE_SOURCES.map(
    ({ from, promotionId }) => `NOT EXISTS (
      SELECT 1
      FROM ${from}
      LEFT JOIN promotion_rule_value prv
        ON prv.promotion_rule_id = pr.id AND prv.deleted_at IS NULL
      WHERE ${promotionId} = ${alias}.id AND ${condition}
    )`
  ).join(" AND ")
}
