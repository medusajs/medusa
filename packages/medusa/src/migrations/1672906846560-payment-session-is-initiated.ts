import { MigrationInterface, QueryRunner } from "typeorm"

export class PaymentSessionIsInitiated1672906846560 implements MigrationInterface {
  name = "1672906846560PaymentSessionIsInitiated"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payment_session ADD COLUMN is_initiated BOOLEAN NOT NULL DEFAULT false
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE payment_session DROP COLUMN is_initiated`)
  }
}
