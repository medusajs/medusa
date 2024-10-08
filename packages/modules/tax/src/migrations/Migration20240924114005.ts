import { Migration } from "@mikro-orm/migrations"

export class Migration20240924114005 extends Migration {
  async up(): Promise<void> {
    this.addSql(`UPDATE "tax_rate" SET code = 'default' WHERE code IS NULL;`)
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_rate" ALTER COLUMN "code" SET NOT NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_rate" ALTER COLUMN "code" DROP NOT NULL;`
    )
  }
}
