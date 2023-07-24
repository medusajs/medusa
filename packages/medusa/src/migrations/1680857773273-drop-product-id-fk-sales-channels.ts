import { MigrationInterface, QueryRunner } from "typeorm"

export class dropProductIdFkSalesChannels1680857773273
  implements MigrationInterface
{
  name = "dropProductIdFkSalesChannels1680857773273"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table if exists "product_sales_channel" drop constraint if exists "FK_5a4d5e1e60f97633547821ec8d6";
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE if exists "product_sales_channel" ADD CONSTRAINT if not exists "FK_5a4d5e1e60f97633547821ec8d6" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE cascade ON UPDATE NO ACTION;
    `)
  }
}
