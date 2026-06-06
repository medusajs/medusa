import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20241202103352 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop index if exists "IDX_invite_email";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invite_email_unique" ON "invite" (email) WHERE deleted_at IS NULL;');

    this.addSql('drop index if exists "IDX_user_email";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_unique" ON "user" (email) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_invite_email_unique";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invite_email" ON "invite" (email) WHERE deleted_at IS NULL;');

    this.addSql('drop index if exists "IDX_user_email_unique";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email" ON "user" (email) WHERE deleted_at IS NULL;');
  }

}
