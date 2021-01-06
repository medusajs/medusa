import { MigrationInterface, QueryRunner } from "typeorm";

export class CurrencyCodePrimary1609785720363 implements MigrationInterface {
    name = 'CurrencyCodePrimary1609785720363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" ADD "payment_session_id" character varying`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "UQ_e078c18a7edd40accfaea4e01c8" UNIQUE ("payment_session_id")`);
        await queryRunner.query(`ALTER TABLE "currency" DROP CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD CONSTRAINT "PK_c2f67b45f0628aa06e9aec8ee5f" PRIMARY KEY ("id", "code")`);
        await queryRunner.query(`COMMENT ON COLUMN "money_amount"."sale_amount" IS NULL`);
        await queryRunner.query(`ALTER TABLE "money_amount" ALTER COLUMN "sale_amount" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "shipping_option" ALTER COLUMN "amount" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "shipping_option"."amount" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."amount_refunded" IS NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "amount_refunded" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "line_item" DROP CONSTRAINT "FK_5371cbaa3be5200f373d24e3d5b"`);
        await queryRunner.query(`ALTER TABLE "line_item" ALTER COLUMN "variant_id" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "line_item"."variant_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "shipping_option" ADD CONSTRAINT "CHK_7a367f5901ae0a5b0df75aee38" CHECK ("amount" >= 0)`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_e078c18a7edd40accfaea4e01c8" FOREIGN KEY ("payment_session_id") REFERENCES "payment_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "line_item" ADD CONSTRAINT "FK_5371cbaa3be5200f373d24e3d5b" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_item" DROP CONSTRAINT "FK_5371cbaa3be5200f373d24e3d5b"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_e078c18a7edd40accfaea4e01c8"`);
        await queryRunner.query(`ALTER TABLE "shipping_option" DROP CONSTRAINT "CHK_7a367f5901ae0a5b0df75aee38"`);
        await queryRunner.query(`COMMENT ON COLUMN "line_item"."variant_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "line_item" ALTER COLUMN "variant_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line_item" ADD CONSTRAINT "FK_5371cbaa3be5200f373d24e3d5b" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "amount_refunded" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "payment"."amount_refunded" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-20 10:49:29.672378'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "shipping_option"."amount" IS NULL`);
        await queryRunner.query(`ALTER TABLE "shipping_option" ALTER COLUMN "amount" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "money_amount" ALTER COLUMN "sale_amount" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "money_amount"."sale_amount" IS NULL`);
        await queryRunner.query(`ALTER TABLE "currency" DROP CONSTRAINT "PK_c2f67b45f0628aa06e9aec8ee5f"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "UQ_e078c18a7edd40accfaea4e01c8"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "payment_session_id"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_723472e41cae44beb0763f4039" ON "currency" ("code") `);
    }

}
