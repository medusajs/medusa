import { MigrationInterface, QueryRunner } from "typeorm"

export class updateCustomerEmailConstraint_1669032280562
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fdb2f3ad8115da4c7718109a6e"`
    )

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_customer_unique_email_for_registered_customer" ON "customer" ("email") WHERE has_account = true`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_customer_unique_email_for_registered_customer"`
    )

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fdb2f3ad8115da4c7718109a6e" ON "customer" ("email") `
    )
  }
}
