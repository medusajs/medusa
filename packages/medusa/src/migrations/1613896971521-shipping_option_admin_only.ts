import { MigrationInterface, QueryRunner } from "typeorm"

export class shippingOptionAdminOnly1613896971521
  implements MigrationInterface {
  name = "shippingOptionAdminOnly1613896971521"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_option" ADD "admin_only" boolean NOT NULL DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_option" DROP COLUMN "admin_only"`
    )
  }
}
