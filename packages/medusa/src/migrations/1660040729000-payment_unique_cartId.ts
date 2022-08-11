import { MigrationInterface, QueryRunner } from "typeorm"

export class paymentUniqueCartId1660204091000 implements MigrationInterface {
  name = "paymentUniqueCartId1660204091000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE UNIQUE INDEX "UniquePaymentActive" ON "payment" ("cart_id") WHERE "canceled_at" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UniquePaymentActive"`)
  }
}
