import { MigrationInterface, QueryRunner } from "typeorm"

export class PaymentSessionIsInitiated1672906846560 implements MigrationInterface {
  name = "paymentSessionIsInitiated1672906846560"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payment_session ADD COLUMN is_initiated BOOLEAN NOT NULL DEFAULT false
    `)

    // Set is_initiated to true if there is more that 0 key in the data. We assume that if data contains any key
    // A payment has been initiated to the payment provider
    await queryRunner.query(`
      UPDATE payment_session SET is_initiated = true WHERE (
          SELECT coalesce(json_array_length(json_agg(keys)), 0)
          FROM jsonb_object_keys(data) AS keys (keys)
      ) > 0
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE payment_session DROP COLUMN is_initiated`)
  }
}
