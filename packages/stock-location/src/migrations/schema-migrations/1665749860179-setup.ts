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
    database: configModule.projectConfig.database_database,
    schema: configModule.projectConfig.database_schema,
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
    database: configModule.projectConfig.database_database,
    schema: configModule.projectConfig.database_schema,
    extra: configModule.projectConfig.database_extra || {},
    migrations: [setup1665749860179],
    logging: true,
  } as ConnectionOptions)

  await connection.undoLastMigration({ transaction: "all" })
}

export class setup1665749860179 implements MigrationInterface {
  name = "setup1665749860179"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "stock_location_address"
      (
        "id" CHARACTER VARYING NOT NULL,
        "created_at" TIMESTAMP WITH TIME zone NOT NULL DEFAULT Now(),
        "updated_at" TIMESTAMP WITH TIME zone NOT NULL DEFAULT Now(),
        "deleted_at" TIMESTAMP WITH TIME zone,
        "address_1" TEXT NOT NULL,
        "address_2" TEXT,
        "city" TEXT,
        "country_code" TEXT NOT NULL,
        "phone" TEXT,
        "province" TEXT,
        "postal_code" TEXT,
        "metadata" JSONB,
        CONSTRAINT "PK_b79bc27285bede680501b7b81a5" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_stock_location_address_country_code" ON "stock_location_address" ("country_code");

      CREATE TABLE "stock_location"
      (
        "id"         CHARACTER VARYING NOT NULL,
        "created_at" TIMESTAMP WITH time zone NOT NULL DEFAULT Now(),
        "updated_at" TIMESTAMP WITH time zone NOT NULL DEFAULT Now(),
        "deleted_at" TIMESTAMP WITH time zone,
        "name"       TEXT NOT NULL,
        "address_id" TEXT NOT NULL,
        "metadata"   JSONB,
        CONSTRAINT "PK_adf770067d0df1421f525fa25cc" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_stock_location_address_id" ON "stock_location" ("address_id");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_stock_location_address_id";
      DROP TABLE "stock_location";

      DROP INDEX "IDX_stock_location_address_country_code";
      DROP TABLE "stock_location_address";
    `)
  }
}
