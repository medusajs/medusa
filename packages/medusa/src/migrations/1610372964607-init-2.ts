import { MigrationInterface, QueryRunner } from "typeorm"

export class init21610372964607 implements MigrationInterface {
  name = "init21610372964607"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "money_amount"."sale_amount" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "money_amount" ALTER COLUMN "sale_amount" SET DEFAULT null`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_ca67dd080aac5ecf99609960cd2"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" ALTER COLUMN "product_id" SET NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "product_variant"."product_id" IS NULL`
    )
    await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_484c329f4783be4e18e5e2ff090"`
    )
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "region_id" SET NOT NULL`
    )
    await queryRunner.query(`COMMENT ON COLUMN "cart"."region_id" IS NULL`)
    await queryRunner.query(`COMMENT ON COLUMN "order"."status" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending'`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "order"."fulfillment_status" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "fulfillment_status" SET DEFAULT 'not_fulfilled'`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "order"."payment_status" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "payment_status" SET DEFAULT 'not_paid'`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "request_method" DROP NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."request_method" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "request_params" DROP NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."request_params" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "request_path" DROP NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."request_path" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "response_code" DROP NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."response_code" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "response_body" DROP NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."response_body" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_ca67dd080aac5ecf99609960cd2" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_484c329f4783be4e18e5e2ff090" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_484c329f4783be4e18e5e2ff090"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_ca67dd080aac5ecf99609960cd2"`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."response_body" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "response_body" SET NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."response_code" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "response_code" SET NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."request_path" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "request_path" SET NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."request_params" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "request_params" SET NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "idempotency_key"."request_method" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "idempotency_key" ALTER COLUMN "request_method" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "payment_status" DROP DEFAULT`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "order"."payment_status" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "fulfillment_status" DROP DEFAULT`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "order"."fulfillment_status" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(`COMMENT ON COLUMN "order"."status" IS NULL`)
    await queryRunner.query(`COMMENT ON COLUMN "cart"."region_id" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "region_id" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_484c329f4783be4e18e5e2ff090" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`)
    await queryRunner.query(
      `COMMENT ON COLUMN "product_variant"."product_id" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" ALTER COLUMN "product_id" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_ca67dd080aac5ecf99609960cd2" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "money_amount" ALTER COLUMN "sale_amount" DROP DEFAULT`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "money_amount"."sale_amount" IS NULL`
    )
  }
}
