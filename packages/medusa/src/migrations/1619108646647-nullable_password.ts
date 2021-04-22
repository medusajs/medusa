import { MigrationInterface, QueryRunner } from "typeorm"

export class nullablePassword1619108646647 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password_hash" DROP NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password_hash" TYPE character varying, ALTER COLUMN "password_hash" NOT NULL`
    )
  }
}
