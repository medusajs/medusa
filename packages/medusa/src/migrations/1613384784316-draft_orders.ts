import {MigrationInterface, QueryRunner} from "typeorm";

export class draftOrders1613384784316 implements MigrationInterface {
    name = 'draftOrders1613384784316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "draft_order_status_enum" AS ENUM('open', 'completed')`);
        await queryRunner.query(`CREATE TABLE "draft_order" ("id" character varying NOT NULL, "status" "draft_order_status_enum" NOT NULL DEFAULT 'open', "display_id" SERIAL NOT NULL, "cart_id" character varying, "order_id" character varying, "canceled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "completed_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, "idempotency_key" character varying, CONSTRAINT "REL_5bd11d0e2a9628128e2c26fd0a" UNIQUE ("cart_id"), CONSTRAINT "REL_8f6dd6c49202f1466ebf21e77d" UNIQUE ("order_id"), CONSTRAINT "PK_f478946c183d98f8d88a94cfcd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e87cc617a22ef4edce5601edab" ON "draft_order" ("display_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5bd11d0e2a9628128e2c26fd0a" ON "draft_order" ("cart_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f6dd6c49202f1466ebf21e77d" ON "draft_order" ("order_id") `);
        await queryRunner.query(`ALTER TABLE "order" ADD "draft_order_id" character varying`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "UQ_727b872f86c7378474a8fa46147" UNIQUE ("draft_order_id")`);
        await queryRunner.query(`ALTER TYPE "cart_type_enum" RENAME TO "cart_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "cart_type_enum" AS ENUM('default', 'swap', 'draft_order', 'payment_link')`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" TYPE "cart_type_enum" USING "type"::"text"::"cart_type_enum"`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" SET DEFAULT 'default'`);
        await queryRunner.query(`DROP TYPE "cart_type_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "cart"."type" IS NULL`);
        await queryRunner.query(`ALTER TABLE "draft_order" ADD CONSTRAINT "FK_5bd11d0e2a9628128e2c26fd0a6" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_order" ADD CONSTRAINT "FK_8f6dd6c49202f1466ebf21e77da" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_727b872f86c7378474a8fa46147" FOREIGN KEY ("draft_order_id") REFERENCES "draft_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store" ADD "payment_link_template" character varying`);
        await queryRunner.query(`ALTER TABLE "shipping_option" ADD "admin_only" boolean NOT NULL DEFAULT false`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_727b872f86c7378474a8fa46147"`);
        await queryRunner.query(`ALTER TABLE "draft_order" DROP CONSTRAINT "FK_8f6dd6c49202f1466ebf21e77da"`);
        await queryRunner.query(`ALTER TABLE "draft_order" DROP CONSTRAINT "FK_5bd11d0e2a9628128e2c26fd0a6"`);
        await queryRunner.query(`COMMENT ON COLUMN "cart"."type" IS NULL`);
        await queryRunner.query(`CREATE TYPE "cart_type_enum_old" AS ENUM('default', 'swap', 'payment_link')`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" TYPE "cart_type_enum_old" USING "type"::"text"::"cart_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" SET DEFAULT 'default'`);
        await queryRunner.query(`DROP TYPE "cart_type_enum"`);
        await queryRunner.query(`ALTER TYPE "cart_type_enum_old" RENAME TO  "cart_type_enum"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "UQ_727b872f86c7378474a8fa46147"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "draft_order_id"`);
        await queryRunner.query(`DROP INDEX "IDX_8f6dd6c49202f1466ebf21e77d"`);
        await queryRunner.query(`DROP INDEX "IDX_5bd11d0e2a9628128e2c26fd0a"`);
        await queryRunner.query(`DROP INDEX "IDX_e87cc617a22ef4edce5601edab"`);
        await queryRunner.query(`DROP TABLE "draft_order"`);
        await queryRunner.query(`DROP TYPE "draft_order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "payment_link_template"`);
        await queryRunner.query(`ALTER TABLE "shipping_option" DROP COLUMN "admin_only"`)
    }

}
