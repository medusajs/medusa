import { MigrationInterface, QueryRunner } from "typeorm"

export class dropMoneyAmountConstraintsForPricingModule1692953518123
  implements MigrationInterface
{
  name = "dropMoneyAmountConstraintsForPricingModule1692953518123"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE IF NOT EXISTS "money_amount_variant"
        (
            "money_amount_id" text NOT NULL,
            "variant_id" text NOT NULL
        );

        INSERT INTO "money_amount_variant" ("money_amount_id", "variant_id")
          SELECT "id", "variant_id" FROM "money_amount";

        ALTER TABLE "money_amount" DROP COLUMN IF EXISTS "variant_id";
        CREATE UNIQUE INDEX IF NOT EXISTS "idx_money_amount_variant_money_amount_id_unique" ON "money_amount_variant" ("money_amount_id");
        CREATE INDEX IF NOT EXISTS "idx_money_amount_variant_variant_id" ON "money_amount_variant" ("variant_id");
      `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP INDEX IF EXISTS "idx_money_amount_variant_money_amount_id_unique";
        DROP INDEX IF EXISTS "idx_money_amount_variant_variant_id";

        ALTER TABLE "money_amount_variant" ADD COLUMN IF NOT EXISTS "variant_id";

        UPDATE "money_amount" SET "variant_id" = "money_amount_variant"."variant_id"
          FROM "money_amount_variant"
          WHERE "money_amount"."id" = "money_amount_variant"."money_amount_id";

        DROP TABLE IF EXISTS "money_amount_variant";

        CREATE INDEX IF NOT EXISTS idx_money_amount_variant_id ON money_amount (variant_id);
      `
    )
  }
}
