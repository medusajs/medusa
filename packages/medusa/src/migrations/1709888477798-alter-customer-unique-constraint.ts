import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterCustomerUniqueConstraint1709888477798 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "customer" DROP CONSTRAINT "UQ_unique_email_for_guests_and_customer_accounts";

      CREATE UNIQUE INDEX "IDX_unique_email_for_guests_and_customer_accounts" ON "customer" ("email", "has_account") WHERE "deleted_at" IS NULL;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ensure we dont have duplicated email,has_account to avoid violation of the previous unique constraint
    await queryRunner.query(`
      WITH RankedCustomers AS (
        SELECT
          id,
          ROW_NUMBER() OVER (
            PARTITION BY email, has_account
            ORDER BY CASE WHEN deleted_at IS NULL THEN 0 ELSE 1 END, id
          ) AS rn
        FROM
          customer
      )
      DELETE FROM customer
      WHERE id IN (
        SELECT id FROM RankedCustomers WHERE rn > 1
      );
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_unique_email_for_guests_and_customer_accounts";

      ALTER TABLE "customer" ADD CONSTRAINT "UQ_unique_email_for_guests_and_customer_accounts" UNIQUE ("email", "has_account");
    `)
  }
}
