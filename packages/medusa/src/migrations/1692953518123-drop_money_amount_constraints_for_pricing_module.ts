import { MigrationInterface, QueryRunner } from "typeorm"

export class dropMoneyAmountConstraintsForPricingModule1692953518123
  implements MigrationInterface
{
  name = "dropMoneyAmountConstraintsForPricingModule1692953518123"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE IF NOT EXISTS "product_variant_money_amount"
        (
            "id" character varying NOT NULL,
            "money_amount_id" text NOT NULL,
            "variant_id" text NOT NULL,
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_product_variant_money_amount" PRIMARY KEY ("id")
        );

        INSERT INTO "product_variant_money_amount"("id", "money_amount_id", "variant_id")
          SELECT CONCAT('pvma_', id), "id", "variant_id" FROM "money_amount";

        ALTER TABLE "money_amount" DROP COLUMN IF EXISTS "variant_id";
        CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_variant_money_amount_money_amount_id_unique" ON "product_variant_money_amount" ("money_amount_id");
        CREATE INDEX IF NOT EXISTS "idx_product_variant_money_amount_variant_id" ON "product_variant_money_amount" ("variant_id");
      `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DROP INDEX IF EXISTS "idx_product_variant_money_amount_money_amount_id_unique";
        DROP INDEX IF EXISTS "idx_product_variant_money_amount_variant_id";

        ALTER TABLE "money_amount" ADD COLUMN IF NOT EXISTS "variant_id" text;

        UPDATE "money_amount" SET "variant_id" = "product_variant_money_amount"."variant_id"
          FROM "product_variant_money_amount"
          WHERE "money_amount"."id" = "product_variant_money_amount"."money_amount_id";

        DROP TABLE IF EXISTS "product_variant_money_amount";

        CREATE INDEX IF NOT EXISTS idx_product_variant_money_amount_id ON money_amount (variant_id);
        ALTER TABLE "money_amount" ADD CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
      `
    )
  }
}
