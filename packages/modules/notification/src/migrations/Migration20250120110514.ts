import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250120110514 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_notification_provider_deleted_at" ON "notification_provider" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_notification_deleted_at" ON "notification" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_notification_provider_deleted_at";');

    this.addSql('drop index if exists "IDX_notification_deleted_at";');
  }

}
