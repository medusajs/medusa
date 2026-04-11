import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250917143818 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_promotion_is_automatic" ON "promotion" (is_automatic) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_promotion_rule_value_rule_id_value" ON "promotion_rule_value" (promotion_rule_id, value) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_promotion_rule_value_value" ON "promotion_rule_value" (value) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_promotion_is_automatic";`)

    this.addSql(
      `drop index if exists "IDX_promotion_rule_value_rule_id_value";`
    )
    this.addSql(`drop index if exists "IDX_promotion_rule_value_value";`)
  }
}
