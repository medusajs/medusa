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
    migrations: [inventorySetup1665748086258],
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
    migrations: [inventorySetup1665748086258],
    logging: true,
  } as ConnectionOptions)

  await connection.undoLastMigration({ transaction: "all" })
}

class inventorySetup1665748086258 implements MigrationInterface {
  name = "inventorySetup1665748086258"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inventory_item" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "sku" text NOT NULL, "origin_country" text NOT NULL, "hs_code" integer NOT NULL, "mid_code" character varying, "material" character varying, "weight" integer, "length" integer, "height" integer, "width" integer, "requires_shipping" boolean NOT NULL, "metadata" jsonb, CONSTRAINT "PK_94f5cbcb5f280f2f30bd4a9fd90" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d6ea8a96077963efdebaa65044" ON "inventory_item" ("sku") `
    )
    await queryRunner.query(
      `CREATE TABLE "inventory_level" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "item_id" text NOT NULL, "location_id" text NOT NULL, "stocked_quantity" integer NOT NULL, "incoming_quantity" integer NOT NULL, "metadata" jsonb, CONSTRAINT "UQ_c30cae2dc580f17624f10ceaf47" UNIQUE ("item_id", "location_id"), CONSTRAINT "PK_e9d89cce26e51fd2e52104308cf" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c4b083a11b388f11aac5ab2882" ON "inventory_level" ("item_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_137dc7218ade448f428b35b18f" ON "inventory_level" ("location_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "reservation_item" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "item_id" text NOT NULL, "location_id" text NOT NULL, "quantity" integer NOT NULL, "metadata" jsonb, CONSTRAINT "PK_0080a75ff7fac5703092e675f50" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_dbeb7c8804d737a6db15e4c03c" ON "reservation_item" ("item_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c0da1599b9cb296f7a6583c2b5" ON "reservation_item" ("location_id") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c0da1599b9cb296f7a6583c2b5"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dbeb7c8804d737a6db15e4c03c"`
    )
    await queryRunner.query(`DROP TABLE "reservation_item"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_137dc7218ade448f428b35b18f"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4b083a11b388f11aac5ab2882"`
    )
    await queryRunner.query(`DROP TABLE "inventory_level"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d6ea8a96077963efdebaa65044"`
    )
    await queryRunner.query(`DROP TABLE "inventory_item"`)
  }
}
