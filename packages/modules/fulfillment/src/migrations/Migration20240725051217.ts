import { Migration } from "@mikro-orm/migrations"

export class Migration20240725051217 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE IF EXISTS "fulfillment" ADD COLUMN IF NOT EXISTS "is_return" boolean NOT NULL DEFAULT false;
      UPDATE "fulfillment" SET is_return = false;
      `)
  }

  async down(): Promise<void> {
    this.addSql(
      `ALTER TABLE IF EXISTS "fulfillment" DROP COLUMN IF EXISTS "is_return";`
    )
  }
}
