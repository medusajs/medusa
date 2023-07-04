import { MigrationInterface, QueryRunner } from "typeorm"

export class deleteDateOnShippingOptionRequirements1632828114899
  implements MigrationInterface {
  name = "deleteDateOnShippingOptionRequirements1632828114899"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_option_requirement" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_option_requirement" DROP COLUMN "deleted_at"`
    )
  }
}
