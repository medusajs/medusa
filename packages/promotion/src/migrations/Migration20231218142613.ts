import { Migration } from '@mikro-orm/migrations';

export class Migration20231218142613 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "promotion" ("id" text not null, constraint "promotion_pkey" primary key ("id"));');
  }

}
