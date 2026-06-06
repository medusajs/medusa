import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241127223829 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'drop index if exists "IDX_price_rule_price_id_attribute_unique";'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_attribute_operator_unique" ON "price_rule" (price_id, attribute, operator) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'drop index if exists "IDX_price_rule_price_id_attribute_operator_unique";'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_attribute_unique" ON "price_rule" (price_id, attribute) WHERE deleted_at IS NULL;'
    )
  }
}
