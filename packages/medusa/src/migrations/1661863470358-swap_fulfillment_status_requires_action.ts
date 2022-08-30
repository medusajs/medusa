import { MigrationInterface, QueryRunner } from "typeorm"

export class swapFulfillmentStatusRequiresAction1661863470358
  implements MigrationInterface
{
  name = "swapFulfillmentStatusRequiresAction1661863470358"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swap" ALTER COLUMN "fulfillment_status" TYPE "public"."swap_fulfillment_status_enum" USING "fulfillment_status"::"text"::"public"."swap_fulfillment_status_enum"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swap" ALTER COLUMN "fulfillment_status" TYPE "public"."swap_fulfillment_status_enum_old" USING "fulfillment_status"::"text"::"public"."swap_fulfillment_status_enum_old"`
    )
  }
}
