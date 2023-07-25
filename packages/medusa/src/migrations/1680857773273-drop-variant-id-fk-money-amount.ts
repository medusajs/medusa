import { MigrationInterface, QueryRunner } from "typeorm"

export class dropVariantIdFkMoneyAmount1680857773273
  implements MigrationInterface
{
  name = "dropVariantIdFkMoneyAmount1680857773273"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        alter table if exists "money_amount" drop constraint if exists "FK_17a06d728e4cfbc5bd2ddb70af0";
      `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE if exists "money_amount" ADD CONSTRAINT if not exists "FK_17a06d728e4cfbc5bd2ddb70af0" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE cascade ON UPDATE NO ACTION;
    `)
  }
}
