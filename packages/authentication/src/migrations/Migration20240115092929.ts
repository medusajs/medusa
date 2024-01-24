import { Migration } from '@mikro-orm/migrations';

export class Migration20240115092929 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_user" add column "entity_id" text not null;');
    this.addSql('alter table "auth_user" add constraint "IDX_auth_user_provider_entity_id" unique ("provider_id", "entity_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_user" drop constraint "IDX_auth_user_provider_entity_id";');
    this.addSql('alter table "auth_user" drop column "entity_id";');
  }

}
