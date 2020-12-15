import { MigrationInterface, QueryRunner } from "typeorm"

export class isSwapDefault1607957458616 implements MigrationInterface {
  name = "isSwapDefault1607957458616"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`
    )
    await queryRunner.query(`COMMENT ON COLUMN "cart"."is_swap" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "is_swap" SET DEFAULT false`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" ALTER COLUMN "is_swap" DROP DEFAULT`
    )
    await queryRunner.query(`COMMENT ON COLUMN "cart"."is_swap" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-14 15:38:59.197864'`
    )
    await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`)
  }
}
