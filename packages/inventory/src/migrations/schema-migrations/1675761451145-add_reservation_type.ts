import { ConfigModule } from "@medusajs/medusa"
import {
  createConnection,
  ConnectionOptions,
  MigrationInterface,
  QueryRunner,
} from "typeorm"

import { CONNECTION_NAME } from "../../config"

export const up = async ({ configModule }: { configModule: ConfigModule }) => {
  const connection = await createConnection({
    name: `${CONNECTION_NAME}.${addReservationType1675761451145.name}`,
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    migrations: [addReservationType1675761451145],
    logging: true,
  } as ConnectionOptions)

  await connection.runMigrations()
  await connection.close()
}

export const down = async ({
  configModule,
}: {
  configModule: ConfigModule
}) => {
  const connection = await createConnection({
    name: `${CONNECTION_NAME}.${addReservationType1675761451145.name}`,
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    migrations: [addReservationType1675761451145],
    logging: true,
  } as ConnectionOptions)

  await connection.undoLastMigration({ transaction: "all" })
  await connection.close()
}

export class addReservationType1675761451145 implements MigrationInterface {
    name = "addReservationType1675761451145"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TYPE "reservation_item_type_enum" AS ENUM('internal', 'external')

          ALTER TABLE "reservation_item" ADD COLUMN "type" "reservation_item_type_enum" NOT NULL DEFAULT 'internal';
        `)
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "reservation_item" DROP COLUMN "type";
          DROP TYPE "reservation_item_type_enum";
        `)
      }

}
