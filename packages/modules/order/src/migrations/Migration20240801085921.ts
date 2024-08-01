import { Migration } from "@mikro-orm/migrations"

export class Migration20240801085921 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "return"
        ADD COLUMN IF NOT exists "requested_at" timestamptz NULL;

      ALTER TYPE return_status_enum ADD VALUE 'open';
      `)
  }
}
