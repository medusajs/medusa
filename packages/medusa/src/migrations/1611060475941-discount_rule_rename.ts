import { MigrationInterface, QueryRunner } from "typeorm"

export class discountRuleRename1611060475941 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount" RENAME COLUMN "discount_rule_id" TO "rule_id"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount" RENAME COLUMN "rule_id" TO "discount_rule_id"`
    )
  }
}
