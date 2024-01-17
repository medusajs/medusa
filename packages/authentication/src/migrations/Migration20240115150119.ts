import { Migration } from '@mikro-orm/migrations';

export class Migration20240115150119 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_provider" add column "config" jsonb null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_provider" drop column "config";');
  }

}
