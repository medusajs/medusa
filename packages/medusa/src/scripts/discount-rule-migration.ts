
import dotenv from "dotenv"
import { createConnection } from "typeorm"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import Logger from "../loaders/logger"
import {
  DiscountCondition,
  DiscountConditionOperator,
  DiscountConditionType,
} from "../models/discount-condition"
import { DiscountConditionProduct } from "../models/discount-condition-product"
import { DiscountRule } from "../models/discount-rule"
import { DiscountConditionRepository } from "../repositories/discount-condition"
import { typeormConfig } from "./db-config"

dotenv.config()

const migrate = async function ({ typeormConfig }): Promise<void> {
  const connection = await createConnection(typeormConfig)

  const BATCH_SIZE = 1000

  await connection.transaction(async (manager) => {
    const discountRuleCount = await manager
      .createQueryBuilder()
      .from(DiscountRule, "dr")
      .getCount()

    let offset = 0
    while (offset < discountRuleCount) {
      const discountRules = await manager
        .createQueryBuilder()
        .from(DiscountRule, "dr")
        .select("dr.id")
        .innerJoin(
          "discount_rule_products",
          "drp",
          "dr.id = drp.discount_rule_id"
        )
        .distinct(true)
        .limit(BATCH_SIZE)
        .offset(offset)
        .getRawMany()

      const discountConditionRepo = manager
        .getCustomRepository(DiscountConditionRepository)
      await manager
        .createQueryBuilder()
        .insert()
        .into(DiscountCondition)
        .values(
          discountRules.map((dr) => discountConditionRepo.create({
            type: DiscountConditionType.PRODUCTS,
            operator: DiscountConditionOperator.IN,
            discount_rule_id: dr.dr_id,
          }) as QueryDeepPartialEntity<DiscountCondition>)
        )
        .orIgnore()
        .execute()
      offset += BATCH_SIZE
    }

    const discountRuleProductCount = await manager.query(
      "SELECT COUNT(*) FROM discount_rule_products"
    )

    offset = 0
    while (offset < parseInt(discountRuleProductCount[0].count)) {
      const getConditionProductsResult = await manager
        .createQueryBuilder()
        .from(DiscountRule, "dr")
        .innerJoin(
          "discount_rule_products",
          "drp",
          "dr.id = drp.discount_rule_id"
        )
        .innerJoin("discount_condition", "dc", "dr.id = dc.discount_rule_id")
        .select("dc.id as cond_id, drp.product_id")
        .limit(BATCH_SIZE)
        .offset(offset)
        .getRawMany()

      await manager
        .createQueryBuilder()
        .insert()
        .into(DiscountConditionProduct)
        .values(
          getConditionProductsResult.map((dr) => ({
            condition_id: dr.cond_id,
            product_id: dr.product_id,
          }))
        )
        .orIgnore()
        .execute()

      offset += BATCH_SIZE
    }
  })

  // Validate results
  const noDanglingProductsValidation = await connection.manager
    .query(`SELECT drp.discount_rule_id, drp.product_id, dcp.product_id FROM "discount_rule_products" drp
  LEFT JOIN discount_condition dc ON dc.discount_rule_id = drp.discount_rule_id
  LEFT JOIN discount_condition_product dcp ON dcp.condition_id = dc.id AND dcp.product_id = drp.product_id
  WHERE dcp.product_id IS NULL`)

  if (
    noDanglingProductsValidation &&
    noDanglingProductsValidation?.length === 0
  ) {
    Logger.info(`Discount entities have been successfully migrated`)
    process.exit()
  } else {
    Logger.error(`Discount entities could not be migrated`)
    process.exit(1)
  }
}

migrate({ typeormConfig })
  .then(() => {
    Logger.info("Database migration completed successfully")
    process.exit()
  })
  .catch((err) => console.log(err))

export default migrate
