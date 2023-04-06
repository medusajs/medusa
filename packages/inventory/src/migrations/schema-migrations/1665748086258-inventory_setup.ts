import { MigrationInterface, QueryRunner } from "typeorm"

export class inventorySetup1665748086258 implements MigrationInterface {
  name = "inventorySetup1665748086258"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inventory_item" (
        "id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "sku" text,
        "origin_country" text,
        "hs_code" text,
        "mid_code" text,
        "material" text,
        "weight" integer,
        "length" integer,
        "height" integer,
        "width" integer,
        "requires_shipping" boolean NOT NULL DEFAULT true,
        "metadata" jsonb,
        CONSTRAINT "PK_inventory_item_id" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX "IDX_inventory_item_sku" ON "inventory_item" ("sku") WHERE deleted_at IS NULL;


      CREATE TABLE "reservation_item" (
        "id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "line_item_id" text,
        "inventory_item_id" text NOT NULL,
        "location_id" text NOT NULL,
        "quantity" integer NOT NULL,
        "metadata" jsonb,
        CONSTRAINT "PK_reservation_item_id" PRIMARY KEY ("id")
      );

      CREATE INDEX "IDX_reservation_item_line_item_id" ON "reservation_item" ("line_item_id") WHERE deleted_at IS NULL;
      CREATE INDEX "IDX_reservation_item_inventory_item_id" ON "reservation_item" ("inventory_item_id") WHERE deleted_at IS NULL;
      CREATE INDEX "IDX_reservation_item_location_id" ON "reservation_item" ("location_id") WHERE deleted_at IS NULL;


      CREATE TABLE "inventory_level" (
        "id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "inventory_item_id" text NOT NULL,
        "location_id" text NOT NULL,
        "stocked_quantity" integer NOT NULL DEFAULT 0,
        "reserved_quantity" integer NOT NULL DEFAULT 0,
        "incoming_quantity" integer NOT NULL DEFAULT 0,
        "metadata" jsonb,
        CONSTRAINT "PK_inventory_level_id" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX "UQ_inventory_level_inventory_item_id_location_id" ON "inventory_level" ("inventory_item_id", "location_id");
      CREATE INDEX "IDX_inventory_level_inventory_item_id" ON "inventory_level" ("inventory_item_id");
      CREATE INDEX "IDX_inventory_level_location_id" ON "inventory_level" ("location_id");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_inventory_level_location_id";
      DROP INDEX "IDX_inventory_level_inventory_item_id";
      DROP INDEX "UQ_inventory_level_inventory_item_id_location_id";
      DROP TABLE "inventory_level";

      DROP INDEX "IDX_reservation_item_location_id";
      DROP INDEX "IDX_reservation_item_inventory_item_id";
      DROP INDEX "IDX_reservation_item_line_item_id";
      DROP TABLE "reservation_item";

      DROP INDEX "IDX_inventory_item_sku";
      DROP TABLE "inventory_item";
    `)
  }
}
