import { MigrationInterface, QueryRunner } from "typeorm"

export class addCustomShippingOptions1633614437919
  implements MigrationInterface {
  name = "addCustomShippingOptions1633614437919"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "tax_rate" TYPE numeric`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "tax_rate" TYPE integer`
    )
  }
}
