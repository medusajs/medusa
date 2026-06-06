import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250207132723 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "payment_collection" drop constraint if exists "payment_collection_status_check";`);

    this.addSql(`alter table if exists "payment_collection" add constraint "payment_collection_status_check" check("status" in ('not_paid', 'awaiting', 'authorized', 'partially_authorized', 'canceled', 'failed', 'completed'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "payment_collection" drop constraint if exists "payment_collection_status_check";`);

    this.addSql(`alter table if exists "payment_collection" add constraint "payment_collection_status_check" check("status" in ('not_paid', 'awaiting', 'authorized', 'partially_authorized', 'canceled'));`);
  }

}
