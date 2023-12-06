import { MigrationInterface, QueryRunner } from "typeorm"

export class StoreDropSCFK1699564715000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" DROP CONSTRAINT IF EXISTS "FK_61b0f48cccbb5f41c750bac7286";`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_61b0f48cccbb5f41c750bac7286" FOREIGN KEY ("default_sales_channel_id") REFERENCES "sales_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;`
    )
  }
}
