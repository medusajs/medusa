import { MigrationInterface, QueryRunner } from "typeorm"
import TaxInclusivePricingFlag from "../loaders/feature-flags/tax-inclusive-pricing"

export const featureFlag = TaxInclusivePricingFlag.key

export class test1659501357661 implements MigrationInterface {
  name = "test1659501357661"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "currency" ADD "includes_tax" boolean NOT NULL DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD "includes_tax" boolean NOT NULL DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_option" ADD "includes_tax" boolean NOT NULL DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "price_list" ADD "includes_tax" boolean NOT NULL DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method" ADD "includes_tax" boolean NOT NULL DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "includes_tax" boolean NOT NULL DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP COLUMN "includes_tax"`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method" DROP COLUMN "includes_tax"`
    )
    await queryRunner.query(
      `ALTER TABLE "price_list" DROP COLUMN "includes_tax"`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_option" DROP COLUMN "includes_tax"`
    )
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "includes_tax"`)
    await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "includes_tax"`)
  }
}
