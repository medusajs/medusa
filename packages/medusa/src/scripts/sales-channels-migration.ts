import dotenv from "dotenv"
import { createConnection } from "typeorm"
import Logger from "../loaders/logger"
import { Product } from "../models/product"
import { Store } from "../models/store"
import { typeormConfig } from "./db-config"

dotenv.config()

const migrate = async function ({ typeormConfig }): Promise<void> {
  const connection = await createConnection(typeormConfig)

  const BATCH_SIZE = 1000

  await connection.transaction(async (manager) => {
    const store: Store | undefined = await manager
      .createQueryBuilder()
      .from(Store, "store")
      .select("store.default_sales_channel_id")
      .getRawOne()

    if (!store?.default_sales_channel_id) {
      Logger.error(
        `The default sales channel does not exists yet. Run your project and then re run the migration.`
      )
      process.exit(1)
    }

    let shouldContinue = true
    while (shouldContinue) {
      const products = await manager
        .createQueryBuilder()
        .from(Product, "product")
        .leftJoin(
          "product_sales_channel",
          "product_sc",
          "product_sc.product_id = product.id"
        )
        .andWhere("product_sc.product_id IS NULL")
        .select("product.id as id")
        .distinct(true)
        .limit(BATCH_SIZE)
        .getRawMany()

      if (products.length > 0) {
        await manager
          .createQueryBuilder()
          .insert()
          .into("product_sales_channel")
          .values(
            products.map((product) => ({
              product_id: product.id,
              sales_channel_id: store.default_sales_channel_id,
            }))
          )
          .orIgnore()
          .execute()
      }

      const danglingProductCount = await manager
        .createQueryBuilder()
        .from(Product, "product")
        .leftJoin(
          "product_sales_channel",
          "product_sc",
          "product_sc.product_id = product.id"
        )
        .andWhere("product_sc.product_id IS NULL")
        .getCount()
      shouldContinue = !!danglingProductCount
    }
  })

  Logger.info(`Product entities have been successfully migrated`)
  process.exit()
}

migrate({ typeormConfig })
  .then(() => {
    Logger.info("Database migration completed successfully")
    process.exit()
  })
  .catch((err) => console.log(err))

export default migrate
