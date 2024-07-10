import { Migration } from '@mikro-orm/migrations';

export class Migration20240710135844 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index if exists "IDX_tax_region_unique_country_province";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tax_region_unique_country_province" ON "tax_region" (country_code, province_code) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tax_region_unique_country_nullable_province" ON "tax_region" (country_code) WHERE province_code IS NULL AND deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_tax_region_unique_country_province";');
    this.addSql('drop index if exists "IDX_tax_region_unique_country_nullable_province";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tax_region_unique_country_province" ON "tax_region" (country_code, province_code);');
  }

}
