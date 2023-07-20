import { MigrationInterface, QueryRunner } from "typeorm"

export class dropProductIdFkSalesChannels1680857773273
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        alter table if exists "product_sales_channel" drop constraint if exists "FK_5a4d5e1e60f97633547821ec8d6";
        create index if not exists "IDX_product_sales_channel_product_id" on "product_sales_channel" ("product_id");
        create index if not exists "IDX_product_sales_channel_sales_channel_id" on "product_sales_channel" ("sales_channel_id");
      `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE if exists "product_sales_channel" ADD CONSTRAINT if not exists "FK_5a4d5e1e60f97633547821ec8d6" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE cascade ON UPDATE NO ACTION;
        DROP INDEX if exists "IDX_product_sales_channel_product_id";
        DROP INDEX if exists "IDX_product_sales_channel_sales_channel_id";
    `)
  }
}
