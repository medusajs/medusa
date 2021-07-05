import { MigrationInterface, QueryRunner } from "typeorm"

export class swapClaimAddStatus1625487702443 implements MigrationInterface {
  name = "swapClaimAddStatus1625487702443"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "claim_order_status_enum" AS ENUM('pending', 'completed', 'canceled')`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" ADD "status" "claim_order_status_enum" NOT NULL DEFAULT 'pending'`
    )
    await queryRunner.query(
      `CREATE TYPE "swap_status_enum" AS ENUM('pending', 'completed', 'canceled')`
    )
    await queryRunner.query(
      `ALTER TABLE "swap" ADD "status" "swap_status_enum" NOT NULL DEFAULT 'pending'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "swap_status_enum"`)
    await queryRunner.query(`ALTER TABLE "claim_order" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "claim_order_status_enum"`)
  }
}
