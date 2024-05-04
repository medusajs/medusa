"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240322113359 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240322113359 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table if exists "price_rule" drop constraint if exists "price_rule_price_id_foreign";');
        this.addSql('drop index if exists "IDX_price_rule_price_id_unique";');
        this.addSql('alter table if exists "price_rule" add constraint "price_rule_price_id_foreign" foreign key ("price_id") references "price" ("id") on update cascade on delete cascade;');
        this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_unique" ON "price_rule" (price_id) WHERE deleted_at IS NULL;');
    }
    async down() {
        this.addSql('alter table if exists "price_rule" drop constraint if exists "price_rule_price_id_foreign";');
        this.addSql('drop index if exists "IDX_price_rule_price_id_unique";');
        this.addSql('alter table if exists "price_rule" add constraint "price_rule_price_id_foreign" foreign key ("price_id") references "price" ("id") on update cascade on delete cascade;');
        this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_unique" ON "price_rule" (price_id) WHERE deleted_at IS NULL;');
    }
}
exports.Migration20240322113359 = Migration20240322113359;
