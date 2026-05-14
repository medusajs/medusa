import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20241211074630 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "customer_group_customer" drop constraint if exists "customer_group_customer_customer_group_id_foreign";'
    )
    this.addSql(
      'alter table if exists "customer_group_customer" drop constraint if exists "customer_group_customer_customer_id_foreign";'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_customer_deleted_at" ON "customer" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "customer_address" add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_customer_address_deleted_at" ON "customer_address" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_customer_group_deleted_at" ON "customer_group" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "customer_group_customer" add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql('drop index if exists "IDX_customer_group_customer_group_id";')
    this.addSql(
      'alter table if exists "customer_group_customer" add constraint "customer_group_customer_customer_group_id_foreign" foreign key ("customer_group_id") references "customer_group" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table if exists "customer_group_customer" add constraint "customer_group_customer_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_customer_group_customer_customer_group_id" ON "customer_group_customer" (customer_group_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_customer_group_customer_deleted_at" ON "customer_group_customer" (deleted_at) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_customer_deleted_at";')

    this.addSql('drop index if exists "IDX_customer_address_deleted_at";')
    this.addSql(
      'alter table if exists "customer_address" drop column if exists "deleted_at";'
    )

    this.addSql('drop index if exists "IDX_customer_group_deleted_at";')

    this.addSql(
      'drop index if exists "IDX_customer_group_customer_customer_group_id";'
    )
    this.addSql(
      'drop index if exists "IDX_customer_group_customer_deleted_at";'
    )
    this.addSql(
      'alter table if exists "customer_group_customer" drop column if exists "deleted_at";'
    )
    this.addSql(
      'create index if not exists "IDX_customer_group_customer_group_id" on "customer_group_customer" ("customer_group_id");'
    )
  }
}
