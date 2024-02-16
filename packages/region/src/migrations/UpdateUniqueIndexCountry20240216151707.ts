import { Migration } from '@mikro-orm/migrations';

export class UpdateUniqueIndexCountry20240216151707 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index if exists "IDX_country_region_id";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_region_country_region_id_iso_2_unique" ON "region_country" (region_id, iso_2);');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_region_country_region_id_iso_2_unique";');
    this.addSql('create index if not exists "IDX_country_region_id" on "region_country" ("region_id");');
  }

}
