import { MigrationInterface, QueryRunner } from "typeorm"

export class updateCustomerEmailConstraint_1669032280562
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_fdb2f3ad8115da4c7718109a6e"`
    )

    await queryRunner.query(
      `ALTER TABLE "customer" ADD CONSTRAINT "UQ_unique_email_for_guests_and_customer_accounts" UNIQUE ("email", "has_account")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" DROP CONSTRAINT "UQ_unique_email_for_guests_and_customer_accounts"`
    )

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fdb2f3ad8115da4c7718109a6e" ON "customer" ("email") `
    )
  }
}
