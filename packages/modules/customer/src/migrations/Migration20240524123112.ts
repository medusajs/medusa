import { Migration } from '@mikro-orm/migrations';

export class Migration20240524123112 extends Migration {
  async up(): Promise<void> {
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_email_has_account_unique" ON "customer" (email, has_account) WHERE deleted_at IS NULL;');

    this.addSql('drop index if exists "IDX_customer_address_unqiue_customer_billing";');
    this.addSql('drop index if exists "IDX_customer_address_unqiue_customer_shipping";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_address_unique_customer_billing" ON "customer_address" (customer_id) WHERE "is_default_billing" = true;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_address_unique_customer_shipping" ON "customer_address" (customer_id) WHERE "is_default_shipping" = true;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_customer_email_has_account_unique";');

    this.addSql('drop index if exists "IDX_customer_address_unique_customer_billing";');
    this.addSql('drop index if exists "IDX_customer_address_unique_customer_shipping";');
    this.addSql('create unique index if not exists "IDX_customer_address_unqiue_customer_billing" on "customer_address" ("customer_id") where "is_default_billing" = true;');
    this.addSql('create unique index if not exists "IDX_customer_address_unique_customer_shipping" on "customer_address" ("customer_id") where "is_default_shipping" = true;');
  }
}
