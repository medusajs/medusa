import { MigrationInterface, QueryRunner } from "typeorm"

export class addTableProductShippingProfile1680857773273
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE IF NOT EXISTS "product_shipping_profile"
        (
            "profile_id" text NOT NULL,
            "product_id" text NOT NULL
        );

        INSERT INTO "product_shipping_profile" ("profile_id", "product_id")
        SELECT "profile_id", "id" FROM "product";

        ALTER TABLE "product" DROP COLUMN IF EXISTS "profile_id";
        ALTER TABLE "product_shipping_profile" ADD CONSTRAINT "pk_product_shipping_profile" PRIMARY KEY ("id");
        CREATE INDEX IF NOT EXISTS "idx_product_shipping_profile_deleted_at" ON "product_shipping_profile" ("deleted_at");
        CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_shipping_profile_profile_id_product_id_unique" ON "product_shipping_profile" ("profile_id", "product_id");
        DROP INDEX IF EXISTS "IDX_80823b7ae866dc5acae2dac6d2";
      `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE "product" SET "profile_id" = "product_shipping_profile"."profile_id" 
        FROM "product_shipping_profile"
        WHERE "product"."id" = "product_shipping_profile"."product_id";

        DROP INDEX IF EXISTS "idx_product_shipping_profile_deleted_at";
        DROP INDEX IF EXISTS "idx_product_shipping_profile_profile_id_product_id_unique";

        DROP TABLE IF EXISTS "product_shipping_profile";

        ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "profile_id" text NOT NULL;

        CREATE INDEX IF NOT EXISTS "IDX_80823b7ae866dc5acae2dac6d2" ON "product" ("profile_id");
        ALTER TABLE "product" ADD CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2c" FOREIGN KEY ("profile_id") REFERENCES "shipping_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `)
  }
}
