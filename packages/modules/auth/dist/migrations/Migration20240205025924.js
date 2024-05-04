"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240205025924 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240205025924 extends migrations_1.Migration {
    async up() {
        this.addSql('create table if not exists "auth_user" ("id" text not null, "entity_id" text not null, "provider" text not null, "scope" text not null, "user_metadata" jsonb null, "app_metadata" jsonb not null, "provider_metadata" jsonb null, constraint "auth_user_pkey" primary key ("id"));');
        this.addSql('alter table "auth_user" add constraint "IDX_auth_user_provider_scope_entity_id" unique ("provider", "scope", "entity_id");');
    }
    async down() {
        this.addSql('drop table if exists "auth_user" cascade;');
    }
}
exports.Migration20240205025924 = Migration20240205025924;
