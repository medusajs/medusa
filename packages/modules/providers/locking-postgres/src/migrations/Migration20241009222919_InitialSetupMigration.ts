import { Migration } from "@mikro-orm/migrations"

export class Migration20241009222919_InitialSetupMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "locking" ("id" text not null, "owner_id" text null, "expiration" timestamptz null, constraint "locking_pkey" primary key ("id"));'
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table "locking";`)
  }
}
