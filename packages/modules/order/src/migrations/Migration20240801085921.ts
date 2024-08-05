import { Migration } from "@mikro-orm/migrations"

export class Migration20240801085921 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
        ALTER TABLE "return"
          ADD COLUMN IF NOT exists "requested_at" timestamptz NULL;

        
        CREATE TYPE return_status_enum_new AS ENUM (
          'open',
          'requested',
          'received',
          'partially_received',
          'canceled'
        );
        ALTER TABLE "return" ALTER COLUMN "status" DROP DEFAULT;
        ALTER TABLE "return" ALTER COLUMN "status" TYPE return_status_enum_new USING "status"::text::return_status_enum_new;
        ALTER TABLE "return" ALTER COLUMN "status" SET DEFAULT 'open';
        DROP TYPE return_status_enum;
      `)
  }
}
