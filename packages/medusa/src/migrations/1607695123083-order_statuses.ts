import {MigrationInterface, QueryRunner} from "typeorm";

export class orderStatuses1607695123083 implements MigrationInterface {
    name = 'orderStatuses1607695123083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "shipping_data" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "return"."shipping_data" IS NULL`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "received_at" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "return"."received_at" IS NULL`);
        await queryRunner.query(`ALTER TYPE "public"."order_fulfillment_status_enum" RENAME TO "order_fulfillment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "order_fulfillment_status_enum" AS ENUM('not_fulfilled', 'partially_fulfilled', 'fulfilled', 'partially_shipped', 'shipped', 'partially_returned', 'returned', 'canceled', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "fulfillment_status" TYPE "order_fulfillment_status_enum" USING "fulfillment_status"::"text"::"order_fulfillment_status_enum"`);
        await queryRunner.query(`DROP TYPE "order_fulfillment_status_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."fulfillment_status" IS NULL`);
        await queryRunner.query(`ALTER TYPE "public"."order_payment_status_enum" RENAME TO "order_payment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "order_payment_status_enum" AS ENUM('not_paid', 'awaiting', 'captured', 'partially_refunded', 'refunded', 'canceled', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "payment_status" TYPE "order_payment_status_enum" USING "payment_status"::"text"::"order_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "order_payment_status_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."payment_status" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "order"."payment_status" IS NULL`);
        await queryRunner.query(`CREATE TYPE "order_payment_status_enum_old" AS ENUM('not_paid', 'awaiting', 'captured', 'partially_refunded', 'refunded', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "payment_status" TYPE "order_payment_status_enum_old" USING "payment_status"::"text"::"order_payment_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "order_payment_status_enum"`);
        await queryRunner.query(`ALTER TYPE "order_payment_status_enum_old" RENAME TO  "order_payment_status_enum"`);
        await queryRunner.query(`COMMENT ON COLUMN "order"."fulfillment_status" IS NULL`);
        await queryRunner.query(`CREATE TYPE "order_fulfillment_status_enum_old" AS ENUM('not_fulfilled', 'partially_fulfilled', 'fulfilled', 'partially_shipped', 'shipped', 'partially_returned', 'returned', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "fulfillment_status" TYPE "order_fulfillment_status_enum_old" USING "fulfillment_status"::"text"::"order_fulfillment_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "order_fulfillment_status_enum"`);
        await queryRunner.query(`ALTER TYPE "order_fulfillment_status_enum_old" RENAME TO  "order_fulfillment_status_enum"`);
        await queryRunner.query(`COMMENT ON COLUMN "return"."received_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "received_at" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "return"."shipping_data" IS NULL`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "shipping_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-11 13:08:03.017348'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
    }

}
