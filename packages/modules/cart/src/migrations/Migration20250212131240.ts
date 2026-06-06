import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250212131240 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "credit_line" ("id" text not null, "cart_id" text not null, "reference" text null, "reference_id" text null, "amount" numeric not null, "raw_amount" jsonb not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "credit_line_pkey" primary key ("id"));`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_credit_line_cart_id" ON "credit_line" (cart_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_credit_line_deleted_at" ON "credit_line" (deleted_at) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_cart_credit_line_reference_reference_id" ON "credit_line" (reference, reference_id) WHERE deleted_at IS NOT NULL;`
    )

    this.addSql(
      `alter table if exists "credit_line" add constraint "credit_line_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "credit_line" cascade;`)
  }
}
