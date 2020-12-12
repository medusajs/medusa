import {MigrationInterface, QueryRunner} from "typeorm";

export class refunds1607683149367 implements MigrationInterface {
    name = 'refunds1607683149367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "refund" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "refund" ADD "note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refund" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "refund" ADD "note" integer`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-11 10:41:34.839138'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
    }

}
