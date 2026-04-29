import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251225120947 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "order"
        DROP CONSTRAINT IF EXISTS "order_shipping_address_id_foreign";

      ALTER TABLE "order"
        ADD CONSTRAINT "order_shipping_address_id_foreign"
        FOREIGN KEY ("shipping_address_id")
        REFERENCES "order_address" ("id")
        ON UPDATE CASCADE
        ON DELETE SET NULL;  

      ALTER TABLE "order"
        DROP CONSTRAINT IF EXISTS "order_billing_address_id_foreign";

      ALTER TABLE "order"
        ADD CONSTRAINT "order_billing_address_id_foreign"
        FOREIGN KEY ("billing_address_id")
        REFERENCES "order_address" ("id")
        ON UPDATE CASCADE
        ON DELETE SET NULL;  
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`
      ALTER TABLE "order"
        DROP CONSTRAINT IF EXISTS "order_shipping_address_id_foreign";

      ALTER TABLE "order"
        ADD CONSTRAINT "order_shipping_address_id_foreign"
        FOREIGN KEY ("shipping_address_id")
        REFERENCES "order_address" ("id")
        ON UPDATE CASCADE
        ON DELETE CASCADE;

      ALTER TABLE "order"
        DROP CONSTRAINT IF EXISTS "order_billing_address_id_foreign";

      ALTER TABLE "order"
        ADD CONSTRAINT "order_billing_address_id_foreign"
        FOREIGN KEY ("billing_address_id")
        REFERENCES "order_address" ("id")
        ON UPDATE CASCADE
        ON DELETE CASCADE;
    `)
  }
}
