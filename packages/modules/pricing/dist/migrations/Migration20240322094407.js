"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240322094407 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240322094407 extends migrations_1.Migration {
    async up() {
        this.addSql('drop table if exists "money_amount" cascade;');
    }
    async down() {
        this.addSql('create table if not exists "money_amount" ("id" text not null, "currency_code" text not null, "amount" numeric not null, "min_quantity" numeric null, "max_quantity" numeric null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "money_amount_pkey" primary key ("id"));');
        this.addSql('CREATE INDEX IF NOT EXISTS "IDX_money_amount_currency_code" ON "money_amount" (currency_code) WHERE deleted_at IS NULL;');
        this.addSql('CREATE INDEX IF NOT EXISTS "IDX_money_amount_deleted_at" ON "money_amount" (deleted_at) WHERE deleted_at IS NOT NULL;');
    }
}
exports.Migration20240322094407 = Migration20240322094407;
