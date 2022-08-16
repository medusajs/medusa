import { MigrationInterface, QueryRunner } from "typeorm"

export class multiPaymentCart1657880770264 implements MigrationInterface {
  name = "multiPaymentCart1657880770264"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "REL_4665f17abc1e81dd58330e5854"`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_aac4855eadda71aa1e4b6d7684" ON "payment" ("cart_id") WHERE canceled_at IS NOT NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UniquePaymentActive" ON "payment" ("cart_id") WHERE "canceled_at" IS NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aac4855eadda71aa1e4b6d7684"`
    )
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "REL_4665f17abc1e81dd58330e5854" UNIQUE ("cart_id")`
    )
    await queryRunner.query(`DROP INDEX "UniquePaymentActive"`)
  }
}
