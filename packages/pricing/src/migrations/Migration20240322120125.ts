import { Migration } from "@mikro-orm/migrations"

export class Migration20240322120125 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop index if exists "IDX_price_rule_price_id_unique";')
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_rule_type_id_unique" ON "price_rule" (price_id, rule_type_id) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'drop index if exists "IDX_price_rule_price_id_rule_type_id_unique";'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_unique" ON "price_rule" (price_id) WHERE deleted_at IS NULL;'
    )
  }
}
