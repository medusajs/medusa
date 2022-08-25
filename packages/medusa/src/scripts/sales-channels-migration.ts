import dotenv from "dotenv"
import { createConnection } from "typeorm"
import Logger from "../loaders/logger"
import { Product } from "../models/product";
import { Store } from "../models/store";

dotenv.config()

const typeormConfig = {
  type: process.env.TYPEORM_CONNECTION,
  url: process.env.TYPEORM_URL,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  migrations: [process.env.TYPEORM_MIGRATIONS as string],
  entities: [process.env.TYPEORM_ENTITIES],
  logging: true,
}

const migrate = async function ({ typeormConfig }): Promise<void> {
  const connection = await createConnection(typeormConfig)

  const BATCH_SIZE = 1000

  await connection.transaction(async (manager) => {
    const store = await manager
      .createQueryBuilder()
      .from(Store, "store")
      .select("store.default_sales_channel_id")
      .getOne() as Store

    if (!store.default_sales_channel_id) {
      Logger.error(`The default sales channel does not exists yet. Run your project and then re run the migration.`)
      process.exit(1)
      return
    }

    let shouldContinue = true
    while (shouldContinue) {
      const products = await manager
        .createQueryBuilder()
        .from(Product, "product")
        .leftJoin("product_sales_channel", "product_sc", "product_sc.product_id = product.id")
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
              sales_channel_id: store.default_sales_channel_id,
              product_id: product.id
            }))
          )
          .orIgnore()
          .execute()
      }

      const danglingProductCount = await manager
        .createQueryBuilder()
        .from(Product, "product")
        .leftJoin("product_sales_channel", "product_sc", "product_sc.product_id = product.id")
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
