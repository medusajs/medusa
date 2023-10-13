import { MigrationInterface, QueryRunner } from "typeorm"

import IsolateProductDomain from "../loaders/feature-flags/isolate-product-domain"

export const featureFlag = IsolateProductDomain.key

export class dropShippingProfileProfileIdProductIdUnique1697103018534
  implements MigrationInterface
{
  name = "DropShippingProfileProfileIdProductIdUnique1697103018534"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_product_shipping_profile_profile_id_product_id_unique";
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_shipping_profile_profile_id_product_id_unique" ON "product_shipping_profile" ("profile_id", "product_id");
    `)
  }
}
