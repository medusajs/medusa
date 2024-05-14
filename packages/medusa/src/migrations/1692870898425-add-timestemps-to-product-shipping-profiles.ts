import { MigrationInterface, QueryRunner } from "typeorm"

export class AddTimestempsToProductShippingProfiles1692870898425
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product_shipping_profile" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
      ALTER TABLE "product_shipping_profile" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
      ALTER TABLE "product_shipping_profile" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP WITH TIME ZONE;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "product_shipping_profile" DROP COLUMN IF NOT EXISTS "created_at";
        ALTER TABLE "product_shipping_profile" DROP COLUMN IF NOT EXISTS "updated_at";
        ALTER TABLE "product_shipping_profile" DROP COLUMN IF NOT EXISTS "deleted_at";
    `)
  }
}
