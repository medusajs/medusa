import { MigrationInterface, QueryRunner } from "typeorm"

export class addTableProductShippingProfile1680857773273
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        alter table product_sales_channel
        drop constraint "FK_5a4d5e1e60f97633547821ec8d6";
      `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "product_sales_channel" ADD CONSTRAINT "FK_5a4d5e1e60f97633547821ec8d6" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE cascade ON UPDATE NO ACTION
    `)
  }
}
