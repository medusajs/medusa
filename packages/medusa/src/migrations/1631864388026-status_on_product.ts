import { MigrationInterface, QueryRunner } from "typeorm"

export class statusOnProduct1631864388026 implements MigrationInterface {
  name = "statusOnProduct1631864388026"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."product_status_enum" AS ENUM('draft', 'proposed', 'published', 'rejected')`
    )
    await queryRunner.query(
      `ALTER TABLE "public"."product" ADD "status" "public"."product_status_enum" `
    )
    await queryRunner.query(
      `UPDATE "public"."product" SET "status" = 'published' WHERE "status" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "public"."product" ALTER COLUMN "status" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "public"."product" ALTER COLUMN "status" SET DEFAULT 'draft'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."product" DROP COLUMN "status"`
    )
    await queryRunner.query(`DROP TYPE "public"."product_status_enum"`)
  }
}
