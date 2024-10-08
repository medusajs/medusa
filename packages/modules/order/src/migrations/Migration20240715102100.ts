import { Migration } from "@mikro-orm/migrations"

export class Migration20240715102100 extends Migration {
  async up(): Promise<void> {
    const sql = `
      ALTER TABLE "return"
        ADD COLUMN if NOT exists "location_id" TEXT NULL;
    `

    this.addSql(sql)
  }
}
