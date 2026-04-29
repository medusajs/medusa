import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251009110625 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_price_list_id_status_starts_at_ends_at" ON "price_list" (id, status, starts_at, ends_at) WHERE deleted_at IS NULL AND status = 'active';`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_price_list_rule_value" ON "price_list_rule" USING gin (value) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_price_rule_attribute_value_price_id" ON "price_rule" (attribute, value, price_id) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_price_list_id_status_starts_at_ends_at";`
    )

    this.addSql(`drop index if exists "IDX_price_list_rule_value";`)

    this.addSql(
      `drop index if exists "IDX_price_rule_attribute_value_price_id";`
    )
  }
}
