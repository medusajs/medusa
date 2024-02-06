import { Migration } from '@mikro-orm/migrations';

export class Migration20240201081925 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" text not null, constraint "user_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
