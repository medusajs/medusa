import {MigrationInterface, QueryRunner} from "typeorm";

export class returns1607688478210 implements MigrationInterface {
    name = 'returns1607688478210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TYPE "public"."refund_reason_enum" RENAME TO "refund_reason_enum_old"`);
        await queryRunner.query(`CREATE TYPE "refund_reason_enum" AS ENUM('discount', 'return', 'other')`);
        await queryRunner.query(`ALTER TABLE "refund" ALTER COLUMN "reason" TYPE "refund_reason_enum" USING "reason"::"text"::"refund_reason_enum"`);
        await queryRunner.query(`DROP TYPE "refund_reason_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "refund"."reason" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "refund"."reason" IS NULL`);
        await queryRunner.query(`CREATE TYPE "refund_reason_enum_old" AS ENUM('discount', 'other')`);
        await queryRunner.query(`ALTER TABLE "refund" ALTER COLUMN "reason" TYPE "refund_reason_enum_old" USING "reason"::"text"::"refund_reason_enum_old"`);
        await queryRunner.query(`DROP TYPE "refund_reason_enum"`);
        await queryRunner.query(`ALTER TYPE "refund_reason_enum_old" RENAME TO  "refund_reason_enum"`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-11 12:38:25.349394'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
    }

}
