import dotenv from "dotenv"
import { createConnection } from "typeorm"
import Logger from "../loaders/logger"
import { Product } from "../models/product";

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
  const queryRunner = connection.createQueryRunner()

  await connection.transaction(async (manager) => {

    let shouldContinue = true
    while (shouldContinue) {
      const products = await manager
        .createQueryBuilder()
        .from(Product, "product")
        .leftJoin('product.collections', 'collections')
        .where("product.collection_id IS NOT NULL")
        .andWhere('collections.id iS NULL')
        .select("product.id as id")
        .addSelect("product.collection_id as collection_id")
        .limit(BATCH_SIZE)
        .getRawMany()

      if (products.length > 0) {
        for (const p of products) {
          await manager.createQueryBuilder()
            .relation(Product, 'collections')
            .of(p.id)
            .add({ id: p.collection_id });
        }
      }

      const productWithCollectionIdCount = await manager
        .createQueryBuilder()
        .from(Product, "product")
        .leftJoin('product.collections', 'collections')
        .where("product.collection_id IS NOT NULL")
        .andWhere('collections.id iS NULL')
        .getCount()
      shouldContinue = !!productWithCollectionIdCount
    }
  })

   await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_49d419fc77d3aed46c835c558ac"`);
   await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "collection_id"`);
  await queryRunner.release()
  process.exit()
}

migrate({ typeormConfig })
  .then(() => {
    Logger.info("Database migration completed successfully")
    process.exit()
  })
  .catch((err) => console.log(err))

export default migrate
