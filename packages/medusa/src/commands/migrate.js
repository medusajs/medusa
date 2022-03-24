import { createConnection } from "typeorm"
import { getConfigFile } from "medusa-core-utils"

import Logger from "../loaders/logger"

import getProjectDirectory from "./utils/get-project-directory"
import { Discount } from "../models/discount"
import { DiscountRule } from "../models/discount-rule"
import {
  DiscountCondition,
  DiscountConditionOperator,
  DiscountConditionType,
} from "../models/discount-condition"
import { DiscountConditionProduct } from "../models/discount-condition-product"

const t = async function ({ directory }) {
  const args = process.argv
  args.shift()
  args.shift()
  args.shift()

  const { configModule } = getConfigFile(directory, `medusa-config`)
  const migrationDirs = getProjectDirectory(directory, "migrations")
  const entitiesDirs = getProjectDirectory(directory, "models")

  const connection = await createConnection({
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    migrations: migrationDirs,
    entities: entitiesDirs,
    logging: true,
  })

  if (args[0] === "run") {
    await connection.runMigrations()
    await connection.close()
    Logger.info("Migrations completed.")
    process.exit()
  } else if (args[0] === "show") {
    const unapplied = await connection.showMigrations()
    console.log(unapplied)
    await connection.close()
    process.exit(unapplied ? 1 : 0)
  } else if (args[0] === "datamodel" && args[1] === "run") {
    const BATCH_SIZE = 1000

    await connection.transaction(async (manager) => {
      const discountRuleCount = await manager
        .createQueryBuilder()
        .from(DiscountRule, "dr")
        .getCount()

      // INSERT INTO discount_condition(id, operator, type, discount_rule_id)
      // (SELECT ROW_NUMBER() OVER(ORDER BY sq.d_id), sq.op, sq.tp, sq.d_id FROM
      // 	(SELECT DISTINCT
      // 			'in'::discount_condition_operator_enum op,
      // 			'products'::discount_condition_type_enum tp,
      // 			discount_rule_products.discount_rule_id d_id
      // 	FROM discount_rule_products) sq)

      let offset = 0
      while (offset < discountRuleCount) {
        const test = await manager
          .createQueryBuilder()
          .from(DiscountRule, "dr")
          .select("dr.id", "dr_id")
          // .orderBy("dr_id")
          .distinct(true)
          .limit(BATCH_SIZE)
          .offset(offset)
          .getRawMany()

        await manager
          .createQueryBuilder()
          .insert()
          .into(DiscountCondition)
          .values(
            test.map((dr) =>
              Object.assign(new DiscountCondition(), {
                type: DiscountConditionType.PRODUCTS,
                operator: DiscountConditionOperator.IN,
                discount_rule_id: dr.dr_id,
              })
            )
          )
          .orIgnore()
          .execute()
        offset += BATCH_SIZE
      }

      const discountRuleProductCount = await manager.query(
        "SELECT COUNT(*) FROM discount_rule_products"
      )

      // INSERT INTO discount_condition_product(condition_id, product_id)
      // (SELECT cond.id, drp.product_id FROM discount_rule_products as drp
      // LEFT JOIN discount_condition as cond ON cond.discount_rule_id = drp.discount_rule_id)

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
          // .orderBy("drp.product_id")
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
      return
    } else {
      Logger.error(`Discount entities could not be migrated`)
      process.exit(1)
      return
    }
  }
}

export default t
