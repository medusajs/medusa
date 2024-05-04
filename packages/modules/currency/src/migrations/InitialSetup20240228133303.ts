import { Migration } from "@mikro-orm/migrations"

export class InitialSetup20240228133303 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      create table if not exists "currency" 
      (
        "code" text not null,
        "symbol" text not null,
        "symbol_native" text not null, 
        "decimal_digits" int not null default 0,
        "rounding" numeric not null default 0,
        "raw_rounding" jsonb not null,
        "name" text not null, 
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        constraint "currency_pkey" primary key ("code")
      );

      ALTER TABLE "currency" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT now();
      ALTER TABLE "currency" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NULL DEFAULT now();

      ALTER TABLE "currency" ADD COLUMN IF NOT EXISTS "decimal_digits" int not null default 0;
      ALTER TABLE "currency" ADD COLUMN IF NOT EXISTS "rounding" numeric not null default 0;
      ALTER TABLE "currency" ADD COLUMN IF NOT EXISTS "raw_rounding" jsonb;
    `)
  }
}
