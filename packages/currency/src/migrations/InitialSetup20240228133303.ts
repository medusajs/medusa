import { Migration } from "@mikro-orm/migrations"

export class InitialSetup20240228133303 extends Migration {
  async up(): Promise<void> {
    const currencyTables = await this.execute(
      "select * from information_schema.tables where table_name = 'currency' and table_schema = 'public'"
    )

    if (currencyTables.length > 0) {
      // This is so we can still run the api tests, remove completely once that is not needed
      this.addSql(
        `alter table "currency" add column "decimal_digits" int not null default 0;`
      )
      this.addSql(
        `alter table "currency" add column "rounding" numeric not null default 0;`
      )
      this.addSql(`alter table "currency" add column "raw_rounding" jsonb;`)
    }

    this.addSql(`create table if not exists "currency" 
    ("code" text not null, "symbol" text not null, "symbol_native" text not null, "name" text not null, 
    "decimal_digits" int not null default 0, "rounding" numeric not null default 0, "raw_rounding" jsonb not null,
    constraint "currency_pkey" primary key ("code"));`)
  }
}
