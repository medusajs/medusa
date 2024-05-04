"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20240322120125 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20240322120125 extends migrations_1.Migration {
    async up() {
        this.addSql('drop index if exists "IDX_price_rule_price_id_unique";');
        this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_rule_type_id_unique" ON "price_rule" (price_id, rule_type_id) WHERE deleted_at IS NULL;');
    }
    async down() {
        this.addSql('drop index if exists "IDX_price_rule_price_id_rule_type_id_unique";');
        this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_rule_price_id_unique" ON "price_rule" (price_id) WHERE deleted_at IS NULL;');
    }
}
exports.Migration20240322120125 = Migration20240322120125;
