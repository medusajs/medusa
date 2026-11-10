import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20240907134741 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "custom_record" ("id" text not null, "key" text not null, "value" jsonb not null default \'{}\', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "custom_record_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_custom_record_key_unique" ON "custom_record" (key) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "custom_record" cascade;');
  }

}
