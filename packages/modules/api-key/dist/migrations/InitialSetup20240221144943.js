"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSetup20240221144943 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class InitialSetup20240221144943 extends migrations_1.Migration {
    async up() {
        this.addSql('create table if not exists "api_key" ("id" text not null, "token" text not null, "salt" text not null, "redacted" text not null, "title" text not null, "type" text not null, "last_used_at" timestamptz null, "created_by" text not null, "created_at" timestamptz not null default now(), "revoked_by" text null, "revoked_at" timestamptz null, constraint "api_key_pkey" primary key ("id"));');
        this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_api_key_token_unique" ON "api_key" (token);');
        this.addSql('CREATE INDEX IF NOT EXISTS "IDX_api_key_type" ON "api_key" (type);');
    }
}
exports.InitialSetup20240221144943 = InitialSetup20240221144943;
