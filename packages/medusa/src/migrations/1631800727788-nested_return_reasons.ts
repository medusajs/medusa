import {MigrationInterface, QueryRunner} from "typeorm";

export class nestedReturnReasons1631800727788 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
   await queryRunner.query(
      `ALTER TABLE "return_reason" ADD "parent_return_reason_id" character varying`
      
      )
      await queryRunner.query(`ALTER TABLE "return_reason" ADD CONSTRAINT "FK_2250c5d9e975987ab212f61a657" FOREIGN KEY ("parent_return_reason_id") REFERENCES "return_reason"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "return_reason" DROP COLUMN "parent_return_reason_id"`
    )

  }

}
