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
    name: CONNECTION_NAME,
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    migrations: [setup1665749860179],
    logging: true,
  } as ConnectionOptions)

  await connection.runMigrations()
}

export const down = async ({
  configModule,
}: {
  configModule: ConfigModule
}) => {
  const connection = await createConnection({
    name: CONNECTION_NAME,
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    migrations: [setup1665749860179],
    logging: true,
  } as ConnectionOptions)

  await connection.undoLastMigration({ transaction: "all" })
}

export class setup1665749860179 implements MigrationInterface {
  name = "setup1665749860179"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stock_location_address" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "address_1" text NOT NULL, "address_2" text, "city" text, "country_code" text, "phone" text, "province" text, "postal_code" text, "metadata" jsonb, CONSTRAINT "PK_b79bc27285bede680501b7b81a5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "stock_location" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" text NOT NULL, "address_id" text, "metadata" jsonb, CONSTRAINT "PK_adf770067d0df1421f525fa25cc" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stock_location"`)
    await queryRunner.query(`DROP TABLE "stock_location_address"`)
  }
}
