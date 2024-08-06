import { Migration } from "@mikro-orm/migrations"

export class Migration20240806072619 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "refund_reason" ("id" text not null, "label" text not null, "description" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "refund_reason_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table if exists "payment_session" drop constraint if exists "payment_session_status_check";'
    )

    this.addSql(
      'alter table if exists "payment_session" drop constraint if exists "payment_session_payment_collection_id_foreign";'
    )

    this.addSql(
      'alter table if exists "payment_session" alter column "status" type text using ("status"::text);'
    )
    this.addSql(
      "alter table if exists \"payment_session\" add constraint \"payment_session_status_check\" check (\"status\" in ('authorized', 'captured', 'pending', 'requires_more', 'error', 'canceled'));"
    )
    this.addSql(
      'create index if not exists "IDX_payment_session_deleted_at" on "payment_session" ("deleted_at");'
    )

    this.addSql('drop index if exists "IDX_capture_deleted_at";')
    this.addSql('drop index if exists "IDX_refund_deleted_at";')
    this.addSql(
      'create index if not exists "IDX_payment_payment_session_id" on "payment" ("payment_session_id");'
    )
    this.addSql(
      'alter table if exists "payment" add constraint "payment_payment_session_id_unique" unique ("payment_session_id");'
    )

    this.addSql(
      'create index if not exists "IDX_capture_deleted_at" on "capture" ("deleted_at");'
    )

    this.addSql(
      'alter table if exists "refund" add column if not exists "refund_reason_id" text null, add column if not exists "note" text null;'
    )
    this.addSql(
      'create index if not exists "IDX_refund_deleted_at" on "refund" ("deleted_at");'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "refund_reason" cascade;')

    this.addSql(
      'alter table if exists "payment_session" drop constraint if exists "payment_session_status_check";'
    )

    this.addSql('drop index if exists "IDX_capture_deleted_at";')

    this.addSql('drop index if exists "IDX_payment_payment_session_id";')
    this.addSql(
      'alter table if exists "payment" drop constraint if exists "payment_payment_session_id_unique";'
    )
    this.addSql(
      'create index if not exists "IDX_capture_deleted_at" on "payment" ("deleted_at");'
    )
    this.addSql(
      'create index if not exists "IDX_refund_deleted_at" on "payment" ("deleted_at");'
    )

    this.addSql(
      'alter table if exists "payment_session" alter column "status" type text using ("status"::text);'
    )
    this.addSql(
      "alter table if exists \"payment_session\" add constraint \"payment_session_status_check\" check (\"status\" in ('authorized', 'pending', 'requires_more', 'error', 'canceled'));"
    )
    this.addSql('drop index if exists "IDX_payment_session_deleted_at";')
    this.addSql('drop index if exists "IDX_refund_deleted_at";')
    this.addSql(
      'alter table if exists "refund" drop column if exists "refund_reason_id";'
    )
    this.addSql('alter table if exists "refund" drop column if exists "note";')
  }
}
