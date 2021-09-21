import { MigrationInterface, QueryRunner } from "typeorm"

export class statusOnProduct1631864388026 implements MigrationInterface {
  name = "statusOnProduct1631864388026"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "product_status_enum" AS ENUM('draft', 'proposed', 'published', 'rejected')`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "status" "product_status_enum" `
    )
    await queryRunner.query(
      `UPDATE "product" SET "status" = 'published' WHERE "status" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "status" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "status" SET DEFAULT 'draft'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "product_status_enum"`)
  }
}
