import { MigrationInterface, QueryRunner } from "typeorm"

export class claims11612170081396 implements MigrationInterface {
  name = "claims11612170081396"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "claim_order_payment_status_enum" AS ENUM('na', 'not_refunded', 'refunded')`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" ADD "payment_status" "claim_order_payment_status_enum" NOT NULL DEFAULT 'na'`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" ADD "refund_amount" integer`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" ADD "idempotency_key" character varying`
    )
    await queryRunner.query(
      `ALTER TYPE "public"."refund_reason_enum" RENAME TO "refund_reason_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "refund_reason_enum" AS ENUM('discount', 'return', 'swap', 'claim', 'other')`
    )
    await queryRunner.query(
      `ALTER TABLE "refund" ALTER COLUMN "reason" TYPE "refund_reason_enum" USING "reason"::"text"::"refund_reason_enum"`
    )
    await queryRunner.query(`DROP TYPE "refund_reason_enum_old"`)
    await queryRunner.query(`COMMENT ON COLUMN "refund"."reason" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "refund"."reason" IS NULL`)
    await queryRunner.query(
      `CREATE TYPE "refund_reason_enum_old" AS ENUM('discount', 'return', 'swap', 'other')`
    )
    await queryRunner.query(
      `ALTER TABLE "refund" ALTER COLUMN "reason" TYPE "refund_reason_enum_old" USING "reason"::"text"::"refund_reason_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "refund_reason_enum"`)
    await queryRunner.query(
      `ALTER TYPE "refund_reason_enum_old" RENAME TO  "refund_reason_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" DROP COLUMN "idempotency_key"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" DROP COLUMN "refund_amount"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" DROP COLUMN "payment_status"`
    )
    await queryRunner.query(`DROP TYPE "claim_order_payment_status_enum"`)
  }
}
