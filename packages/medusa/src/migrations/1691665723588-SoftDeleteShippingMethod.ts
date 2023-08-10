import { MigrationInterface, QueryRunner } from "typeorm"

export class SoftDeleteShippingMethod1691665723588
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE shipping_method
      ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE;

      ALTER TABLE shipping_method
      ADD COLUMN "created_at" TIMESTAMP WITH TIME ZONE;

      ALTER TABLE shipping_method
      ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE shipping_method
      DROP COLUMN "deleted_at";

      ALTER TABLE shipping_method
      DROP COLUMN "created_at";

      ALTER TABLE shipping_method
      DROP COLUMN "updated_at";
    `)
  }
}
