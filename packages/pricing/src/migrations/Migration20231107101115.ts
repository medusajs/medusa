import { Migration } from '@mikro-orm/migrations';

export class Migration20231107101115 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "price_list" add column "title" text not null, add column "description" text not null, add column "type" text check ("type" in (\'sale\', \'override\')) not null default \'sale\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "price_list" drop column "title";');
    this.addSql('alter table "price_list" drop column "description";');
    this.addSql('alter table "price_list" drop column "type";');
  }

}
