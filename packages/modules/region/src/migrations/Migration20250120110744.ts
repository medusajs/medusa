import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250120110744 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_region_deleted_at" ON "region" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_region_country_region_id" ON "region_country" (region_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_region_country_deleted_at" ON "region_country" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_region_deleted_at";');

    this.addSql('drop index if exists "IDX_region_country_region_id";');
    this.addSql('drop index if exists "IDX_region_country_deleted_at";');
  }

}
