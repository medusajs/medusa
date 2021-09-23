import { MigrationInterface, QueryRunner } from "typeorm"

export class accountingCodesCostPrice1632412193447
  implements MigrationInterface {
  name = "accountingCodesCostPrice1632412193447"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "region" ADD "sales_nominal_code" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD "shipping_nominal_code" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD "gift_card_nominal_code" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD "accounts_receivable_nominal_code" character varying`
    )
    await queryRunner.query(
      `CREATE TYPE "money_amount_type_enum" AS ENUM('retail', 'cost')`
    )
    await queryRunner.query(
      `ALTER TABLE "money_amount" ADD "type" "money_amount_type_enum" NOT NULL DEFAULT 'retail'`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD "cost_price_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "UQ_4121596ea1bd42927b088735b78" UNIQUE ("cost_price_id")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "UQ_4121596ea1bd42927b088735b78"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP COLUMN "cost_price_id"`
    )
    await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "money_amount_type_enum"`)
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "accounts_receivable_nominal_code"`
    )
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "gift_card_nominal_code"`
    )
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "shipping_nominal_code"`
    )
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "sales_nominal_code"`
    )
  }
}
