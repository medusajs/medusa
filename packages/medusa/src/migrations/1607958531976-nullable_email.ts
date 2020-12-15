import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableEmail1607958531976 implements MigrationInterface {
    name = 'nullableEmail1607958531976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "cart"."email" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "cart"."email" IS NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-14 16:07:56.144114'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
    }

}
