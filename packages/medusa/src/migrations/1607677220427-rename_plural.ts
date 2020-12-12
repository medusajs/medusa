import {MigrationInterface, QueryRunner} from "typeorm";

export class renamePlural1607677220427 implements MigrationInterface {
    name = 'renamePlural1607677220427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-10 17:42:31.121242'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
    }

}
