import { MigrationInterface, QueryRunner } from "typeorm"

export class retOwnsSwap1610554312172 implements MigrationInterface {
  name = "retOwnsSwap1610554312172"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swap" DROP CONSTRAINT "FK_ebd3e02011ca6e072302e569d52"`
    )
    await queryRunner.query(
      `ALTER TABLE "swap" DROP CONSTRAINT "REL_ebd3e02011ca6e072302e569d5"`
    )
    await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "return_id"`)
    await queryRunner.query(`COMMENT ON COLUMN "return"."swap_id" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "return" ADD CONSTRAINT "UQ_bad82d7bff2b08b87094bfac3d6" UNIQUE ("swap_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ADD CONSTRAINT "FK_bad82d7bff2b08b87094bfac3d6" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "return" DROP CONSTRAINT "FK_bad82d7bff2b08b87094bfac3d6"`
    )
    await queryRunner.query(
      `ALTER TABLE "return" DROP CONSTRAINT "UQ_bad82d7bff2b08b87094bfac3d6"`
    )
    await queryRunner.query(`COMMENT ON COLUMN "return"."swap_id" IS NULL`)
    await queryRunner.query(
      `ALTER TABLE "swap" ADD "return_id" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "swap" ADD CONSTRAINT "REL_ebd3e02011ca6e072302e569d5" UNIQUE ("return_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "swap" ADD CONSTRAINT "FK_ebd3e02011ca6e072302e569d52" FOREIGN KEY ("return_id") REFERENCES "return"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
