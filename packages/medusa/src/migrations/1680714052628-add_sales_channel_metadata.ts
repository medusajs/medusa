import { MigrationInterface, QueryRunner } from "typeorm"
import SalesChannelFeatureFlag from "../loaders/feature-flags/sales-channels"

export const featureFlag = SalesChannelFeatureFlag.key

export class addSalesChannelMetadata1680714052628
  implements MigrationInterface
{
  name = "addSalesChannelMetadata1680714052628"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sales_channel" ADD COLUMN "metadata" jsonb NULL;`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sales_channel" DROP COLUMN "metadata"`
    )
  }
}
