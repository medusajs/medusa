import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260924125937 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "refund" drop constraint if exists "refund_payment_id_idempotency_key_unique";`);

    this.addSql(`alter table if exists "refund" add column if not exists "status" text check ("status" in ('pending', 'succeeded', 'failed')) not null default 'pending', add column if not exists "idempotency_key" text null;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_refund_payment_id_idempotency_key_unique" ON "refund" ("payment_id", "idempotency_key") WHERE idempotency_key IS NOT NULL AND deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_refund_payment_id_idempotency_key_unique";`);
    this.addSql(`alter table if exists "refund" drop column if exists "status", drop column if exists "idempotency_key";`);
  }

}
