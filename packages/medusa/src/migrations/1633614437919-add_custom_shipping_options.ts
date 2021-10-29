import {MigrationInterface, QueryRunner} from "typeorm";

export class addCustomShippingOptions1633614437919 implements MigrationInterface {
    name = 'addCustomShippingOptions1633614437919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "custom_shipping_option" ("id" character varying NOT NULL, "price" integer NOT NULL, "shipping_option_id" character varying NOT NULL, "cart_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "UQ_0f838b122a9a01d921aa1cdb669" UNIQUE ("shipping_option_id", "cart_id"), CONSTRAINT "PK_8dfcb5c1172c29eec4a728420cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_44090cb11b06174cbcc667e91c" ON "custom_shipping_option" ("shipping_option_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_93caeb1bb70d37c1d36d6701a7" ON "custom_shipping_option" ("cart_id") `);
        await queryRunner.query(`ALTER TYPE "cart_type_enum" RENAME TO "cart_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "cart_type_enum" AS ENUM('default', 'swap', 'draft_order', 'payment_link', 'claim')`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" TYPE "cart_type_enum" USING "type"::"text"::"cart_type_enum"`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" SET DEFAULT 'default'`);
        await queryRunner.query(`DROP TYPE "cart_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "custom_shipping_option" ADD CONSTRAINT "FK_44090cb11b06174cbcc667e91ca" FOREIGN KEY ("shipping_option_id") REFERENCES "shipping_option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "custom_shipping_option" ADD CONSTRAINT "FK_93caeb1bb70d37c1d36d6701a7a" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "custom_shipping_option" DROP CONSTRAINT "FK_93caeb1bb70d37c1d36d6701a7a"`);
        await queryRunner.query(`ALTER TABLE "custom_shipping_option" DROP CONSTRAINT "FK_44090cb11b06174cbcc667e91ca"`);
        await queryRunner.query(`CREATE TYPE "cart_type_enum_old" AS ENUM('default', 'swap', 'draft_order', 'payment_link')`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" TYPE "cart_type_enum_old" USING "type"::"text"::"cart_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "type" SET DEFAULT 'default'`);
        await queryRunner.query(`DROP TYPE "cart_type_enum"`);
        await queryRunner.query(`ALTER TYPE "cart_type_enum_old" RENAME TO "cart_type_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_93caeb1bb70d37c1d36d6701a7"`);
        await queryRunner.query(`DROP INDEX "IDX_44090cb11b06174cbcc667e91c"`);
        await queryRunner.query(`DROP TABLE "custom_shipping_option"`);
    }

}
