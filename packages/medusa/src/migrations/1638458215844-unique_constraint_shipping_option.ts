import { MigrationInterface, QueryRunner } from "typeorm"

export class uniqueConstraintShippingOption1638458215844
  implements MigrationInterface
{
  name = "uniqueConstraintShippingOption1638458215844"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_method" ADD CONSTRAINT "unique shipping option for cart" UNIQUE ("cart_id", "shipping_option_id")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_method" DROP CONSTRAINT "unique shipping option for cart"`
    )
  }
}
