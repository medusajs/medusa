import { Migration } from "@mikro-orm/migrations"

export class InitialSetup20240226130829 extends Migration {
  async up(): Promise<void> {
    // TODO: The migration needs to take care of moving data before dropping columns, among other things
    const storeTables = await this.execute(
      "select * from information_schema.tables where table_name = 'store' and table_schema = 'public'"
    )

    if (storeTables.length > 0) {
      this.addSql(`alter table "store" alter column "id" TYPE text;`)
      this.addSql(`alter table "store" alter column "name" TYPE text;`)
      this.addSql(
        `alter table "store" alter column "name" SET DEFAULT 'Medusa Store';`
      )
      this.addSql(
        `alter table "store" alter column "default_sales_channel_id" TYPE text;`
      )
      this.addSql(
        `alter table "store" alter column "default_location_id" TYPE text;`
      )

      this.addSql(`alter table "store" add column "default_region_id" text;`)
      this.addSql(
        `alter table "store" add column "deleted_at" timestamptz null;`
      )

      this.addSql(
        'create index if not exists "IDX_store_deleted_at" on "store" (deleted_at) where deleted_at is not null;'
      )

      // this.addSql(`alter table "store" drop column "default_currency_code";`)
      // this.addSql(`alter table "store" drop column "swap_link_template";`)
      // this.addSql(`alter table "store" drop column "payment_link_template";`)
      // this.addSql(`alter table "store" drop column "invite_link_template";`)
    } else {
      this.addSql(`create table if not exists "store" 
      ("id" text not null, "name" text not null default \'Medusa Store\', 
      "default_sales_channel_id" text null, "default_region_id" text null, "default_location_id" text null, 
      "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, 
      constraint "store_pkey" primary key ("id"));`)

      this.addSql(
        'create index if not exists "IDX_store_deleted_at" on "store" (deleted_at) where deleted_at is not null;'
      )
    }
  }
}
