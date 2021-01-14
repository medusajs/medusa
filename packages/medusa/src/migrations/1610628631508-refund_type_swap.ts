import { MigrationInterface, QueryRunner } from "typeorm";

export class refundTypeSwap1610628631508 implements MigrationInterface {
    name = 'refundTypeSwap1610628631508'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TYPE "public"."refund_reason_enum" RENAME TO "refund_reason_enum_old"`);
        await queryRunner.query(`CREATE TYPE "refund_reason_enum" AS ENUM('discount', 'return', 'swap', 'other')`);
        await queryRunner.query(`ALTER TABLE "refund" ALTER COLUMN "reason" TYPE "refund_reason_enum" USING "reason"::"text"::"refund_reason_enum"`);
        await queryRunner.query(`DROP TYPE "refund_reason_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "refund"."reason" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "refund"."reason" IS NULL`);
        await queryRunner.query(`CREATE TYPE "refund_reason_enum_old" AS ENUM('discount', 'return', 'other')`);
        await queryRunner.query(`ALTER TABLE "refund" ALTER COLUMN "reason" TYPE "refund_reason_enum_old" USING "reason"::"text"::"refund_reason_enum_old"`);
        await queryRunner.query(`DROP TYPE "refund_reason_enum"`);
        await queryRunner.query(`ALTER TYPE "refund_reason_enum_old" RENAME TO  "refund_reason_enum"`);
    }

}
