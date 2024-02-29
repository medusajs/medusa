import { Migration } from "@mikro-orm/migrations"

export class InitialSetup20240228133303 extends Migration {
  async up(): Promise<void> {
    this.addSql(`create table if not exists "currency" 
    ("code" text not null, "symbol" text not null, "symbol_native" text not null, "name" text not null, 
    constraint "currency_pkey" primary key ("code"));`)
  }
}
