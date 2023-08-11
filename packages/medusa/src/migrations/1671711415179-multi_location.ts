import { MigrationInterface, QueryRunner } from "typeorm"

export class multiLocation1671711415179 implements MigrationInterface {
  name = "multiLocation1671711415179"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sales_channel_location" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sales_channel_id" text NOT NULL, "location_id" text NOT NULL, CONSTRAINT "PK_afd2c2c52634bc8280a9c9ee533" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6caaa358f12ed0b846f00e2dcd" ON "sales_channel_location" ("sales_channel_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c2203162ca946a71aeb98390b0" ON "sales_channel_location" ("location_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "product_variant_inventory_item" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "inventory_item_id" text NOT NULL, "variant_id" text NOT NULL, "quantity" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_c9be7c1b11a1a729eb51d1b6bca" UNIQUE ("variant_id", "inventory_item_id"), CONSTRAINT "PK_9a1188b8d36f4d198303b4f7efa" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c74e8c2835094a37dead376a3b" ON "product_variant_inventory_item" ("inventory_item_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bf5386e7f2acc460adbf96d6f3" ON "product_variant_inventory_item" ("variant_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "return" ADD "location_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "fulfillment" ADD "location_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "store" ADD "default_location_id" character varying`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" DROP COLUMN "default_location_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "fulfillment" DROP COLUMN "location_id"`
    )
    await queryRunner.query(`ALTER TABLE "return" DROP COLUMN "location_id"`)
    await queryRunner.query(`DROP INDEX "IDX_bf5386e7f2acc460adbf96d6f3"`)
    await queryRunner.query(`DROP INDEX "IDX_c74e8c2835094a37dead376a3b"`)
    await queryRunner.query(`DROP TABLE "product_variant_inventory_item"`)
    await queryRunner.query(`DROP INDEX "IDX_c2203162ca946a71aeb98390b0"`)
    await queryRunner.query(`DROP INDEX "IDX_6caaa358f12ed0b846f00e2dcd"`)
    await queryRunner.query(`DROP TABLE "sales_channel_location"`)
  }
}
