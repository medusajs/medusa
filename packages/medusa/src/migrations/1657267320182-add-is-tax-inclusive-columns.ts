import { MigrationInterface, QueryRunner } from "typeorm"
import TaxInclusiveFeatureFlag from "../loaders/feature-flags/tax-inclusive";

export const featureFlag = TaxInclusiveFeatureFlag.key

export class addIsTaxInclusiveColumns1657267320182 implements MigrationInterface {
  name = "addIsTaxInclusiveColumns1657267320182"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "currency" ADD "includes_tax" boolean DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD "includes_tax" boolean DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_option" ADD "includes_tax" boolean DEFAULT false`
    )
    await queryRunner.query(
      `ALTER TABLE "price_list" ADD "includes_tax" boolean DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "currency" DROP COLUMN "includes_tax"`
    )
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "includes_tax"`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_option" DROP COLUMN "includes_tax"`
    )
    await queryRunner.query(
      `ALTER TABLE "price_list" DROP COLUMN "includes_tax"`
    )
  }
}
