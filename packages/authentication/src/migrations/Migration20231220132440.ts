import { Migration } from '@mikro-orm/migrations';

export class Migration20231220132440 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth_user" ("id" text not null, constraint "auth_user_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "auth_user" cascade;');
  }

}
