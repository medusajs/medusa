"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240115152146 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240115152146 extends migrations_1.Migration {
    async up() {
        this.addSql('create table if not exists "sales_channel" ("id" text not null, "name" text not null, "description" text null, "is_disabled" boolean not null default false, "metadata" jsonb NULL, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "sales_channel_pkey" primary key ("id"));');
        this.addSql('create index "IDX_sales_channel_deleted_at" on "sales_channel" ("deleted_at");');
    }
}
exports.Migration20240115152146 = Migration20240115152146;
