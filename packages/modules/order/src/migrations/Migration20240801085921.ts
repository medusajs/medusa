import { Migration } from "@mikro-orm/migrations"

export class Migration20240801085921 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
        ALTER TABLE "return"
          ADD COLUMN IF NOT exists "requested_at" timestamptz NULL;

        
        ALTER TABLE "return" ALTER COLUMN "status" DROP DEFAULT;
        ALTER TABLE "return" ALTER COLUMN "status" TYPE text USING "status"::text;
        DROP TYPE return_status_enum;

        CREATE TYPE return_status_enum AS ENUM (
          'open',
          'requested',
          'received',
          'partially_received',
          'canceled'
        );
        
        ALTER TABLE "return" ALTER COLUMN "status" TYPE return_status_enum USING "status"::text::return_status_enum;
        ALTER TABLE "return" ALTER COLUMN "status" SET DEFAULT 'open';        
      `)
  }
}
