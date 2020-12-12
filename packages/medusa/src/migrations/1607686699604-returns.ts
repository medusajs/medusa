import {MigrationInterface, QueryRunner} from "typeorm";

export class returns1607686699604 implements MigrationInterface {
    name = 'returns1607686699604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "return" ADD "shipping_data" jsonb NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-11 11:39:13.578747'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "return" DROP COLUMN "shipping_data"`);
    }

}
