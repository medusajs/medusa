import { MigrationInterface, QueryRunner } from "typeorm"
import { MedusaV2Flag } from "@medusajs/utils"

export const featureFlag = MedusaV2Flag.key

export class PublishableKeySalesChannelLink1701894188811
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "publishable_api_key_sales_channel" ADD COLUMN IF NOT EXISTS "id" text;
        UPDATE "publishable_api_key_sales_channel" SET "id" = 'pksc_' || substr(md5(random()::text), 0, 27) WHERE id is NULL;
        ALTER TABLE "publishable_api_key_sales_channel" ALTER COLUMN "id" SET NOT NULL;

        ALTER TABLE "publishable_api_key_sales_channel" DROP CONSTRAINT IF EXISTS "PK_68eaeb14bdac8954460054c567c";

        ALTER TABLE "publishable_api_key_sales_channel" ADD CONSTRAINT "PK_68eaeb14bdac8954460054c567c" PRIMARY KEY (id);

        ALTER TABLE "product_sales_channel" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
        ALTER TABLE "product_sales_channel" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
        ALTER TABLE "product_sales_channel" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP WITH TIME ZONE;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE publishable_api_key_sales_channel DROP CONSTRAINT IF EXISTS "PK_68eaeb14bdac8954460054c567c";

        ALTER TABLE publishable_api_key_sales_channel drop column if exists "id";
        ALTER TABLE "publishable_api_key_sales_channel" DROP COLUMN IF EXISTS "created_at";
        ALTER TABLE "publishable_api_key_sales_channel" DROP COLUMN IF EXISTS "updated_at";
        ALTER TABLE "publishable_api_key_sales_channel" DROP COLUMN IF EXISTS "deleted_at";

        ALTER TABLE publishable_api_key_sales_channel ADD CONSTRAINT "PK_68eaeb14bdac8954460054c567c" PRIMARY KEY (sales_channel_id, publishable_key_id);
    `)
  }
}
