import { MigrationInterface, QueryRunner } from "typeorm"

export class taxLineConstraints1648641130007 implements MigrationInterface {
  name = "taxLineConstraints1648641130007"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "line_item_tax_line" ADD CONSTRAINT "UQ_3c2af51043ed7243e7d9775a2ad" UNIQUE ("item_id", "code")`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method_tax_line" ADD CONSTRAINT "UQ_cd147fca71e50bc954139fa3104" UNIQUE ("shipping_method_id", "code")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_method_tax_line" DROP CONSTRAINT "UQ_cd147fca71e50bc954139fa3104"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_tax_line" DROP CONSTRAINT "UQ_3c2af51043ed7243e7d9775a2ad"`
    )
  }
}
