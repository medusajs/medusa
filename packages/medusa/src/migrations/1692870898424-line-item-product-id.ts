import { MigrationInterface, QueryRunner } from "typeorm"

export class LineItemProductId1692870898424 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "line_item" DROP CONSTRAINT IF EXISTS "FK_5371cbaa3be5200f373d24e3d5b";
      ALTER TABLE "line_item" ADD COLUMN IF NOT EXISTS "product_id" text;

      UPDATE "line_item" SET "product_id" = pv."product_id"
      FROM "product_variant" pv
      WHERE "line_item"."variant_id" = "pv"."id";
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "line_item" DROP COLUMN IF EXISTS "product_id";
      ALTER TABLE "line_item" ADD CONSTRAINT "FK_5371cbaa3be5200f373d24e3d5b" FOREIGN KEY ("variant_id") REFERENCES "product_variant" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `)
  }
}
