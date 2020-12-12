import {MigrationInterface, QueryRunner} from "typeorm";

export class orderGcs1607706173319 implements MigrationInterface {
    name = 'orderGcs1607706173319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_gift_cards" ("order_id" character varying NOT NULL, "gift_card_id" character varying NOT NULL, CONSTRAINT "PK_49a8ec66a6625d7c2e3526e05b4" PRIMARY KEY ("order_id", "gift_card_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e62ff11e4730bb3adfead979ee" ON "order_gift_cards" ("order_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2bb9f71e95b315eb24b2b84cb" ON "order_gift_cards" ("gift_card_id") `);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TYPE "public"."swap_fulfillment_status_enum" RENAME TO "swap_fulfillment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "swap_fulfillment_status_enum" AS ENUM('not_fulfilled', 'fulfilled', 'canceled', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "swap" ALTER COLUMN "fulfillment_status" TYPE "swap_fulfillment_status_enum" USING "fulfillment_status"::"text"::"swap_fulfillment_status_enum"`);
        await queryRunner.query(`DROP TYPE "swap_fulfillment_status_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "swap"."fulfillment_status" IS NULL`);
        await queryRunner.query(`ALTER TYPE "public"."swap_payment_status_enum" RENAME TO "swap_payment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "swap_payment_status_enum" AS ENUM('not_paid', 'awaiting', 'captured', 'canceled', 'partially_refunded', 'refunded', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "swap" ALTER COLUMN "payment_status" TYPE "swap_payment_status_enum" USING "payment_status"::"text"::"swap_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "swap_payment_status_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "swap"."payment_status" IS NULL`);
        await queryRunner.query(`ALTER TABLE "order_gift_cards" ADD CONSTRAINT "FK_e62ff11e4730bb3adfead979ee2" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_gift_cards" ADD CONSTRAINT "FK_f2bb9f71e95b315eb24b2b84cb3" FOREIGN KEY ("gift_card_id") REFERENCES "gift_card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_gift_cards" DROP CONSTRAINT "FK_f2bb9f71e95b315eb24b2b84cb3"`);
        await queryRunner.query(`ALTER TABLE "order_gift_cards" DROP CONSTRAINT "FK_e62ff11e4730bb3adfead979ee2"`);
        await queryRunner.query(`COMMENT ON COLUMN "swap"."payment_status" IS NULL`);
        await queryRunner.query(`CREATE TYPE "swap_payment_status_enum_old" AS ENUM('not_paid', 'awaiting', 'captured', 'partially_refunded', 'refunded', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "swap" ALTER COLUMN "payment_status" TYPE "swap_payment_status_enum_old" USING "payment_status"::"text"::"swap_payment_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "swap_payment_status_enum"`);
        await queryRunner.query(`ALTER TYPE "swap_payment_status_enum_old" RENAME TO  "swap_payment_status_enum"`);
        await queryRunner.query(`COMMENT ON COLUMN "swap"."fulfillment_status" IS NULL`);
        await queryRunner.query(`CREATE TYPE "swap_fulfillment_status_enum_old" AS ENUM('not_fulfilled', 'fulfilled', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "swap" ALTER COLUMN "fulfillment_status" TYPE "swap_fulfillment_status_enum_old" USING "fulfillment_status"::"text"::"swap_fulfillment_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "swap_fulfillment_status_enum"`);
        await queryRunner.query(`ALTER TYPE "swap_fulfillment_status_enum_old" RENAME TO  "swap_fulfillment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-11 14:58:53.652632'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`DROP INDEX "IDX_f2bb9f71e95b315eb24b2b84cb"`);
        await queryRunner.query(`DROP INDEX "IDX_e62ff11e4730bb3adfead979ee"`);
        await queryRunner.query(`DROP TABLE "order_gift_cards"`);
    }

}
