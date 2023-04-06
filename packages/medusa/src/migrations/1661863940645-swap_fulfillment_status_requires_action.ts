import { MigrationInterface, QueryRunner } from "typeorm"

export class swapFulfillmentStatusRequiresAction1661863940645
  implements MigrationInterface
{
  name = "swapFulfillmentStatusRequiresAction1661863940645"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "swap_fulfillment_status_enum" RENAME TO "swap_fulfillment_status_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "swap_fulfillment_status_enum" AS ENUM('not_fulfilled', 'fulfilled', 'shipped', 'partially_shipped', 'canceled', 'requires_action')`
    )
    await queryRunner.query(
      `ALTER TABLE "swap" ALTER COLUMN "fulfillment_status" TYPE "swap_fulfillment_status_enum" USING "fulfillment_status"::"text"::"swap_fulfillment_status_enum"`
    )
    await queryRunner.query(`DROP TYPE "swap_fulfillment_status_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "swap_fulfillment_status_enum_old" AS ENUM('not_fulfilled', 'fulfilled', 'shipped', 'canceled', 'requires_action')`
    )
    await queryRunner.query(
      `ALTER TABLE "swap" ALTER COLUMN "fulfillment_status" TYPE "swap_fulfillment_status_enum_old" USING "fulfillment_status"::"text"::"swap_fulfillment_status_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "swap_fulfillment_status_enum"`)
    await queryRunner.query(
      `ALTER TYPE "swap_fulfillment_status_enum_old" RENAME TO "swap_fulfillment_status_enum"`
    )
  }
}
