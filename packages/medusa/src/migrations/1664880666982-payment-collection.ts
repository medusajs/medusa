import { MigrationInterface, QueryRunner } from "typeorm"

export class paymentCollection1664880666982 implements MigrationInterface {
  name = "paymentCollection1664880666982"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE "PAYMENT_COLLECTION_TYPE_ENUM" AS ENUM ('order_edit');

        CREATE TYPE "PAYMENT_COLLECTION_STATUS_ENUM" AS ENUM (
            'not_paid', 'awaiting', 'authorized',
            'partially_authorized', 'canceled'
        );

        CREATE TABLE IF NOT EXISTS payment_collection
        (
            id character varying NOT NULL,
            created_at timestamp WITH time zone NOT NULL DEFAULT Now(),
            updated_at timestamp WITH time zone NOT NULL DEFAULT Now(),
            deleted_at timestamp WITH time zone NULL,
            type "PAYMENT_COLLECTION_TYPE_ENUM" NOT NULL,
            status "PAYMENT_COLLECTION_STATUS_ENUM" NOT NULL,
            description text NULL,
            amount integer NOT NULL,
            authorized_amount integer NULL,
            region_id character varying NOT NULL,
            currency_code character varying NOT NULL,
            metadata jsonb NULL,
            created_by character varying NOT NULL,
            CONSTRAINT "PK_payment_collection_id" PRIMARY KEY ("id")
        );
        CREATE INDEX "IDX_payment_collection_region_id" ON "payment_collection" ("region_id") WHERE deleted_at IS NULL;
        CREATE INDEX "IDX_payment_collection_currency_code" ON "payment_collection" ("currency_code") WHERE deleted_at IS NULL;

        ALTER TABLE "payment_collection" ADD CONSTRAINT "FK_payment_collection_region_id" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;


        CREATE TABLE payment_collection_sessions
        (
            payment_collection_id CHARACTER VARYING NOT NULL,
            payment_session_id  CHARACTER VARYING NOT NULL,
            CONSTRAINT "PK_payment_collection_sessions" PRIMARY KEY ("payment_collection_id", "payment_session_id")
        );
        CREATE INDEX "IDX_payment_collection_sessions_payment_collection_id" ON "payment_collection_sessions" ("payment_collection_id");
        CREATE INDEX "IDX_payment_collection_sessions_payment_session_id" ON "payment_collection_sessions" ("payment_session_id");

        ALTER TABLE "payment_collection_sessions" ADD CONSTRAINT "FK_payment_collection_sessions_payment_collection_id" FOREIGN KEY ("payment_collection_id") REFERENCES "payment_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        ALTER TABLE "payment_collection_sessions" ADD CONSTRAINT "FK_payment_collection_sessions_payment_session_id" FOREIGN KEY ("payment_session_id") REFERENCES "payment_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION;


        CREATE TABLE payment_collection_payments
        (
            payment_collection_id CHARACTER VARYING NOT NULL,
            payment_id  CHARACTER VARYING NOT NULL,
            CONSTRAINT "PK_payment_collection_payments" PRIMARY KEY ("payment_collection_id", "payment_id")
        );
        CREATE INDEX "IDX_payment_collection_payments_payment_collection_id" ON "payment_collection_payments" ("payment_collection_id");
        CREATE INDEX "IDX_payment_collection_payments_payment_id" ON "payment_collection_payments" ("payment_id");

        ALTER TABLE "payment_collection_payments" ADD CONSTRAINT "FK_payment_collection_payments_payment_collection_id" FOREIGN KEY ("payment_collection_id") REFERENCES "payment_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        ALTER TABLE "payment_collection_payments" ADD CONSTRAINT "FK_payment_collection_payments_payment_id" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;


        ALTER TABLE order_edit ADD COLUMN payment_collection_id character varying NULL;
        CREATE INDEX "IDX_order_edit_payment_collection_id" ON "order_edit" ("payment_collection_id");
        ALTER TABLE "order_edit" ADD CONSTRAINT "FK_order_edit_payment_collection_id" FOREIGN KEY ("payment_collection_id") REFERENCES "payment_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

        ALTER TABLE payment_session ADD COLUMN payment_authorized_at timestamp WITH time zone NULL;
        ALTER TABLE payment_session ADD COLUMN amount integer NULL;
        ALTER TABLE payment_session ALTER COLUMN cart_id DROP NOT NULL;

        ALTER TABLE refund ADD COLUMN payment_id character varying NULL;
        CREATE INDEX "IDX_refund_payment_id" ON "refund" ("payment_id");
        ALTER TABLE "refund" ADD CONSTRAINT "FK_refund_payment_id" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        ALTER TABLE refund ALTER COLUMN order_id DROP NOT NULL;
    `)

    // Add missing indexes
    await queryRunner.query(`
        CREATE INDEX "IDX_order_edit_order_id" ON "order_edit" ("order_id");
        CREATE INDEX "IDX_money_amount_currency_code" ON "money_amount" ("currency_code");
        CREATE INDEX "IDX_order_currency_code" ON "order" ("currency_code");
        CREATE INDEX "IDX_payment_currency_code" ON "payment" ("currency_code");
        CREATE INDEX "IDX_region_currency_code" ON "region" ("currency_code");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "IDX_order_edit_payment_collection_id";
        ALTER TABLE order_edit DROP CONSTRAINT "FK_order_edit_payment_collection_id";

        DROP INDEX "IDX_refund_payment_id";
        ALTER TABLE refund DROP CONSTRAINT "FK_refund_payment_id";
        ALTER TABLE refund ALTER COLUMN order_id SET NOT NULL;

        ALTER TABLE payment_collection DROP CONSTRAINT "FK_payment_collection_region_id";
        ALTER TABLE payment_collection_sessions DROP CONSTRAINT "FK_payment_collection_sessions_payment_collection_id";
        ALTER TABLE payment_collection_sessions DROP CONSTRAINT "FK_payment_collection_sessions_payment_session_id";
        ALTER TABLE payment_collection_payments DROP CONSTRAINT "FK_payment_collection_payments_payment_collection_id";
        ALTER TABLE payment_collection_payments DROP CONSTRAINT "FK_payment_collection_payments_payment_id";
        ALTER TABLE order_edit DROP COLUMN payment_collection_id;
        ALTER TABLE payment_session DROP COLUMN payment_authorized_at;
        ALTER TABLE payment_session DROP COLUMN amount;
        ALTER TABLE payment_session ALTER COLUMN cart_id SET NOT NULL;
        ALTER TABLE refund DROP COLUMN payment_id;

        DROP TABLE payment_collection;
        DROP TABLE payment_collection_sessions;
        DROP TABLE payment_collection_payments;

        DROP TYPE "PAYMENT_COLLECTION_TYPE_ENUM";
        DROP TYPE "PAYMENT_COLLECTION_STATUS_ENUM";
    `)

    await queryRunner.query(`
        DROP INDEX "IDX_order_edit_order_id";
        DROP INDEX "IDX_money_amount_currency_code";
        DROP INDEX "IDX_order_currency_code";
        DROP INDEX "IDX_payment_currency_code";
        DROP INDEX "IDX_region_currency_code";
    `)
  }
}
