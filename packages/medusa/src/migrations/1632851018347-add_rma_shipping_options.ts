import {MigrationInterface, QueryRunner} from "typeorm";

export class addRmaShippingOptions1632851018347 implements MigrationInterface {
    name = 'addRmaShippingOptions1632851018347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rma_shipping_option" ("id" character varying NOT NULL, "price" integer NOT NULL, "shipping_option_id" character varying NOT NULL, "swap_id" character varying, "claim_order_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_12d2eebc6cef997c9057b338647" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f3618cd0930a2e7357eddbebf4" ON "rma_shipping_option" ("shipping_option_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4e4c2c0a3223c79a84a6f54e58" ON "rma_shipping_option" ("swap_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e262bb0e324b501d80a69f9df" ON "rma_shipping_option" ("claim_order_id") `);
        await queryRunner.query(`ALTER TYPE "public"."cart_type_enum" RENAME TO "cart_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."cart_type_enum" AS ENUM('default', 'swap', 'draft_order', 'payment_link', 'claim')`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "type" TYPE "public"."cart_type_enum" USING "type"::"text"::"public"."cart_type_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "type" SET DEFAULT 'default'`);
        await queryRunner.query(`DROP TYPE "public"."cart_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "rma_shipping_option" ADD CONSTRAINT "FK_f3618cd0930a2e7357eddbebf4c" FOREIGN KEY ("shipping_option_id") REFERENCES "shipping_option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rma_shipping_option" ADD CONSTRAINT "FK_4e4c2c0a3223c79a84a6f54e583" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rma_shipping_option" ADD CONSTRAINT "FK_2e262bb0e324b501d80a69f9df4" FOREIGN KEY ("claim_order_id") REFERENCES "claim_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rma_shipping_option" DROP CONSTRAINT "FK_2e262bb0e324b501d80a69f9df4"`);
        await queryRunner.query(`ALTER TABLE "rma_shipping_option" DROP CONSTRAINT "FK_4e4c2c0a3223c79a84a6f54e583"`);
        await queryRunner.query(`ALTER TABLE "rma_shipping_option" DROP CONSTRAINT "FK_f3618cd0930a2e7357eddbebf4c"`);
        await queryRunner.query(`CREATE TYPE "public"."cart_type_enum_old" AS ENUM('default', 'swap', 'draft_order', 'payment_link')`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "type" TYPE "public"."cart_type_enum_old" USING "type"::"text"::"public"."cart_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "public"."cart" ALTER COLUMN "type" SET DEFAULT 'default'`);
        await queryRunner.query(`DROP TYPE "public"."cart_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."cart_type_enum_old" RENAME TO "cart_type_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_2e262bb0e324b501d80a69f9df"`);
        await queryRunner.query(`DROP INDEX "IDX_4e4c2c0a3223c79a84a6f54e58"`);
        await queryRunner.query(`DROP INDEX "IDX_f3618cd0930a2e7357eddbebf4"`);
        await queryRunner.query(`DROP TABLE "rma_shipping_option"`);
    }

}
