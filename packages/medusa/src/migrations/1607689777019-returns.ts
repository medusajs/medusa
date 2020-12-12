import {MigrationInterface, QueryRunner} from "typeorm";

export class returns1607689777019 implements MigrationInterface {
    name = 'returns1607689777019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "shipping_data" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "return"."shipping_data" IS NULL`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "received_at" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "return"."received_at" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "return"."received_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "received_at" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "return"."shipping_data" IS NULL`);
        await queryRunner.query(`ALTER TABLE "return" ALTER COLUMN "shipping_data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-11 13:08:03.017348'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
    }

}
