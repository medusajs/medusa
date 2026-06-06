import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250409122219 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_price_rule_attribute" ON "price_rule" (attribute) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_price_rule_attribute";`);
  }

}
