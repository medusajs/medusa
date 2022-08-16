import { MigrationInterface, QueryRunner } from "typeorm"

export class paymentSessionUniqCartIdProviderId1660040729000
  implements MigrationInterface
{
  name = "paymentSessionUniqCartIdProviderId1660040729000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UniqPaymentSessionCartIdProviderId" ON "payment_session" ("cart_id", "provider_id")`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UniquePaymentActive" ON "payment" ("cart_id") WHERE "canceled_at" IS NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UniqPaymentSessionCartIdProviderId"`)
    await queryRunner.query(`DROP INDEX "UniquePaymentActive"`)
  }
}
