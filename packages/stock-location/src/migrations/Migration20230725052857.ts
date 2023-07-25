import { Migration } from "@mikro-orm/migrations"

export class Migration20230725052857 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "stock_location_address"
      (
        "id" text not null,
        "created_at" timestamptz not null,
        "updated_at" timestamptz not null,
        "deleted_at" timestamptz null,
        "address_1" text not null,
        "address_2" text null,
        "company" text null,
        "city" text null,
        "country_code" text not null,
        "phone" text null,
        "province" text null,
        "postal_code" text null,
        "metadata" jsonb null,
        constraint "stock_location_address_pkey" primary key ("id")
      );`
    )
    this.addSql(
      `create index "IDX_stock_location_address_country_code" on "stock_location_address" ("country_code");`
    )

    this.addSql(
      `create table "stock_location" 
       (
         "id" text not null,
         "created_at" timestamptz not null,
         "updated_at" timestamptz not null,
         "deleted_at" timestamptz null,
         "name" text not null,
         "address_id" text null,
         "metadata" jsonb null,
         constraint "stock_location_pkey" primary key ("id")
       );`
    )
    this.addSql(
      `create index "stock_location_address_id_index" on "stock_location" ("address_id");`
    )

    this.addSql(
      `alter table "stock_location" add constraint "stock_location_address_id_foreign" foreign key ("address_id") references "stock_location_address" ("id") on update cascade on delete set null;`
    )
  }
}
