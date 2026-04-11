import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260411223700 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "payment_session" drop constraint if exists "payment_session_status_check";`
    )

    this.addSql(
      `alter table if exists "payment_session" add constraint "payment_session_status_check" check("status" in ('authorized', 'captured', 'pending', 'requires_more', 'error', 'canceled', 'pending_authorization'));`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "payment_session" drop constraint if exists "payment_session_status_check";`
    )

    this.addSql(
      `alter table if exists "payment_session" add constraint "payment_session_status_check" check("status" in ('authorized', 'captured', 'pending', 'requires_more', 'error', 'canceled'));`
    )
  }
}
