import { Migration } from "@mikro-orm/migrations"

export class Migration20240112104455 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "payment-collection" ("id" text not null, "currency_code" text null, "amount" numeric not null, "authorized_amount" numeric null, "refunded_amount" numeric null, "region_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "completed_at" timestamptz null, "status" text check ("status" in (\'not_paid\', \'awaiting\', \'authorized\', \'partially_authorized\', \'canceled\')) not null default \'not_paid\', constraint "payment-collection_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_payment_collection_deleted_at" on "payment-collection" ("deleted_at");'
    )

    this.addSql(
      'create table if not exists "payment-method-token" ("id" text not null, "provider_id" text not null, "data" jsonb null, "name" text not null, "type_detail" text null, "description_detail" text null, "metadata" jsonb null, constraint "payment-method-token_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table if not exists "payment-provider" ("id" text not null, "is_enabled" boolean not null default true, constraint "payment-provider_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table if not exists "payment-collection_payment_providers" ("payment_collection_id" text not null, "payment_provider_id" text not null, constraint "payment-collection_payment_providers_pkey" primary key ("payment_collection_id", "payment_provider_id"));'
    )

    this.addSql(
      'create table if not exists "payment-session" ("id" text not null, "currency_code" text null, "amount" numeric not null, "provider_id" text not null, "data" jsonb null, "status" text check ("status" in (\'authorized\', \'pending\', \'requires_more\', \'error\', \'canceled\')) not null, "is_selected" boolean null, "authorised_at" timestamptz null, "payment_collection_id" text not null, constraint "payment-session_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table if not exists "payment" ("id" text not null, "amount" numeric not null, "authorized_amount" numeric null, "currency_code" text not null, "provider_id" text not null, "cart_id" text null, "order_id" text null, "customer_id" text null, "data" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "captured_at" timestamptz null, "canceled_at" timestamptz null, "payment_collection_id" text not null, "session_id" text not null, constraint "payment_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_payment_deleted_at" on "payment" ("deleted_at");'
    )
    this.addSql(
      'alter table "payment" add constraint "payment_session_id_unique" unique ("session_id");'
    )

    this.addSql(
      'create table if not exists "capture" ("id" text not null, "amount" numeric not null, "payment_id" text not null, "created_at" timestamptz not null default now(), "created_by" text null, constraint "capture_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table if not exists "refund" ("id" text not null, "amount" numeric not null, "payment_id" text not null, "created_at" timestamptz not null default now(), "created_by" text null, constraint "refund_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "payment-collection_payment_providers" add constraint "payment-collection_payment_providers_payment_coll_6b015_foreign" foreign key ("payment_collection_id") references "payment-collection" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "payment-collection_payment_providers" add constraint "payment-collection_payment_providers_payment_provider_id_foreign" foreign key ("payment_provider_id") references "payment-provider" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "payment-session" add constraint "payment-session_payment_collection_id_foreign" foreign key ("payment_collection_id") references "payment-collection" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "payment" add constraint "payment_payment_collection_id_foreign" foreign key ("payment_collection_id") references "payment-collection" ("id") on update cascade;'
    )
    this.addSql(
      'alter table "payment" add constraint "payment_session_id_foreign" foreign key ("session_id") references "payment-session" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "capture" add constraint "capture_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "refund" add constraint "refund_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete cascade;'
    )
  }
}
