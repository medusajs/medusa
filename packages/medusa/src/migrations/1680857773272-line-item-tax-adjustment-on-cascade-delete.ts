import { MigrationInterface, QueryRunner } from "typeorm"

export class lineItemTaxAdjustmentOnCascadeDelete1680857773272
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "line_item_tax_line" DROP CONSTRAINT IF EXISTS "FK_5077fa54b0d037e984385dfe8ad"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_tax_line" ADD CONSTRAINT "FK_5077fa54b0d037e984385dfe8ad" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )

    await queryRunner.query(
      `ALTER TABLE "line_item_adjustment" DROP CONSTRAINT IF EXISTS "FK_be9aea2ccf3567007b6227da4d2"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_adjustment" ADD CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "line_item_tax_line" DROP CONSTRAINT "FK_5077fa54b0d037e984385dfe8ad"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_tax_line" ADD CONSTRAINT "FK_5077fa54b0d037e984385dfe8ad" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    await queryRunner.query(
      `ALTER TABLE "line_item_adjustment" DROP CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_adjustment" ADD CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
