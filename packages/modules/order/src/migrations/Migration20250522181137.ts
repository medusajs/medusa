import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250522181137 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `DELETE FROM "order_summary" WHERE "order_id" NOT IN (SELECT id FROM "order");`
    )

    this.addSql(`ALTER TABLE "order_summary" 
        ADD CONSTRAINT 
          "order_summary_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "order" ("id") 
        ON UPDATE CASCADE 
        ON DELETE CASCADE;`)
  }

  override async down(): Promise<void> {
    this.addSql(
      `ALTER TABLE "order_summary" DROP CONSTRAINT IF EXISTS "order_summary_order_id_foreign";`
    )
  }
}
