import { MigrationInterface, QueryRunner } from "typeorm"

export class lineItemOriginalItemRelation1663059812400
  implements MigrationInterface
{
  name = "lineItemOriginalItemRelation1663059812400"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "line_item"
          ADD COLUMN IF NOT EXISTS original_item_id character varying,
          ADD COLUMN IF NOT EXISTS order_edit_id character varying`
    )

    await queryRunner.query(
      `ALTER TABLE "line_item"
          ADD CONSTRAINT "line_item_original_item_fk" FOREIGN KEY ("original_item_id") REFERENCES "line_item" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item"
          ADD CONSTRAINT "line_item_order_edit_fk" FOREIGN KEY ("order_edit_id") REFERENCES "order_edit" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_li_original_item_id_order_edit_id" ON "line_item" ("order_edit_id", "original_item_id") WHERE original_item_id IS NOT NULL AND order_edit_id IS NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "unique_li_original_item_id_order_edit_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP CONSTRAINT "line_item_original_item_fk"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP CONSTRAINT "line_item_order_edit_fk"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP COLUMN "original_item_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP COLUMN "order_edit_id"`
    )
  }
}
