import { MigrationInterface, QueryRunner } from "typeorm"

export class nullableOrderTaxRate1640017856004 implements MigrationInterface {
  name = "nullableOrderTaxRate1640017856004"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "tax_rate" DROP NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "tax_rate" SET NOT NULL`
    )
  }
}
