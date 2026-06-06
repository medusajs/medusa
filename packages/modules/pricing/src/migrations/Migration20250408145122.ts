import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250408145122 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_price_list_rule_attribute" ON "price_list_rule" (attribute) WHERE deleted_at IS NULL;`);

    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_price_rule_attribute_value" ON "price_rule" (attribute, value) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_price_rule_operator_value" ON "price_rule" (operator, value) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_price_list_rule_attribute";`);

    this.addSql(`drop index if exists "IDX_price_rule_attribute_value";`);
    this.addSql(`drop index if exists "IDX_price_rule_operator_value";`);
  }

}
