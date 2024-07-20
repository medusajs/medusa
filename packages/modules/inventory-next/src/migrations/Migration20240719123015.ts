import { Migration } from "@mikro-orm/migrations"

export class Migration20240719123015 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      ` 
        ALTER TABLE "reservation_item" ALTER COLUMN "quantity" TYPE numeric;
        ALTER TABLE "reservation_item" ADD COLUMN IF NOT EXISTS "raw_quantity" JSONB NULL;

        ALTER TABLE "inventory_level" ALTER COLUMN "stocked_quantity" TYPE numeric;
        ALTER TABLE "inventory_level" ADD COLUMN IF NOT EXISTS "raw_stocked_quantity" JSONB NULL;

        ALTER TABLE "inventory_level" ALTER COLUMN "reserved_quantity" TYPE numeric;
        ALTER TABLE "inventory_level" ADD COLUMN IF NOT EXISTS "raw_reserved_quantity" JSONB NULL;

        ALTER TABLE "inventory_level" ALTER COLUMN "incoming_quantity" TYPE numeric;
        ALTER TABLE "inventory_level" ADD COLUMN IF NOT EXISTS "raw_incoming_quantity" JSONB NULL;


        DROP INDEX IF EXISTS "IDX_inventory_item_sku_unique";
        DROP INDEX IF EXISTS "IDX_inventory_level_inventory_item_id";
        DROP INDEX IF EXISTS "IDX_inventory_level_location_id";
        DROP INDEX IF EXISTS "IDX_reservation_item_line_item_id";
        DROP INDEX IF EXISTS "IDX_reservation_item_location_id";
        DROP INDEX IF EXISTS "IDX_reservation_item_inventory_item_id";

        CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inventory_item_sku_unique" ON "inventory_item" (sku) WHERE deleted_at IS NOT NULL;
        CREATE INDEX IF NOT EXISTS "IDX_inventory_level_inventory_item_id" ON "inventory_level" (inventory_item_id) WHERE deleted_at IS NOT NULL;
        CREATE INDEX IF NOT EXISTS "IDX_inventory_level_location_id" ON "inventory_level" (location_id) WHERE deleted_at IS NOT NULL;
        CREATE INDEX IF NOT EXISTS "IDX_reservation_item_line_item_id" ON "reservation_item" (line_item_id) WHERE deleted_at IS NOT NULL;
        CREATE INDEX IF NOT EXISTS "IDX_reservation_item_location_id" ON "reservation_item" (location_id) WHERE deleted_at IS NOT NULL;
        CREATE INDEX IF NOT EXISTS "IDX_reservation_item_inventory_item_id" ON "reservation_item" (inventory_item_id) WHERE deleted_at IS NOT NULL;

      `
    )
  }

  async down(): Promise<void> {
    this.addSql(
      ` 
        ALTER TABLE "reservation_item" ALTER COLUMN "quantity" TYPE integer;
        ALTER TABLE "reservation_item" DROP COLUMN IF EXISTS "raw_quantity";

        ALTER TABLE "inventory_level" ALTER COLUMN "stocked_quantity" TYPE integer;
        ALTER TABLE "inventory_level" DROP COLUMN IF NOT EXISTS "raw_stocked_quantity";

        ALTER TABLE "inventory_level" ALTER COLUMN "reserved_quantity" TYPE integer;
        ALTER TABLE "inventory_level" DROP COLUMN IF NOT EXISTS "raw_reserved_quantity";

        ALTER TABLE "inventory_level" ALTER COLUMN "incoming_quantity" TYPE integer;
        ALTER TABLE "inventory_level" DROP COLUMN IF NOT EXISTS "raw_incoming_quantity";


        DROP INDEX IF EXISTS "IDX_inventory_item_sku_unique";
        DROP INDEX IF EXISTS "IDX_inventory_level_inventory_item_id";
        DROP INDEX IF EXISTS "IDX_inventory_level_location_id";
        DROP INDEX IF EXISTS "IDX_reservation_item_line_item_id";
        DROP INDEX IF EXISTS "IDX_reservation_item_location_id";
        DROP INDEX IF EXISTS "IDX_reservation_item_inventory_item_id";

        CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inventory_item_sku_unique" ON "inventory_item" (sku);
        CREATE INDEX IF NOT EXISTS "IDX_inventory_level_inventory_item_id" ON "inventory_level" (inventory_item_id);
        CREATE INDEX IF NOT EXISTS "IDX_inventory_level_location_id" ON "inventory_level" (location_id);
        CREATE INDEX IF NOT EXISTS "IDX_reservation_item_line_item_id" ON "reservation_item" (line_item_id);
        CREATE INDEX IF NOT EXISTS "IDX_reservation_item_location_id" ON "reservation_item" (location_id);
        CREATE INDEX IF NOT EXISTS "IDX_reservation_item_inventory_item_id" ON "reservation_item" (inventory_item_id);
      `
    )
  }
}
