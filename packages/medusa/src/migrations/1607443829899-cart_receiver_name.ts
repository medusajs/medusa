import {MigrationInterface, QueryRunner} from "typeorm";

export class cartReceiverName1607443829899 implements MigrationInterface {
    name = 'cartReceiverName1607443829899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_8abe81b9aac151ae60bf507ad15"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "api_token"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "has_account"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_8abe81b9aac151ae60bf507ad15"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "billing_address_id"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "receiver_email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "billing_address_id" character varying`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_8abe81b9aac151ae60bf507ad15" UNIQUE ("billing_address_id")`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "has_account" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "api_token" character varying NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_8abe81b9aac151ae60bf507ad15" FOREIGN KEY ("billing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_8abe81b9aac151ae60bf507ad15"`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-08 16:11:28.852439'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "api_token"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "has_account"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "UQ_8abe81b9aac151ae60bf507ad15"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "billing_address_id"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "receiver_email"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "billing_address_id" character varying`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "UQ_8abe81b9aac151ae60bf507ad15" UNIQUE ("billing_address_id")`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "has_account" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "api_token" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_8abe81b9aac151ae60bf507ad15" FOREIGN KEY ("billing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
