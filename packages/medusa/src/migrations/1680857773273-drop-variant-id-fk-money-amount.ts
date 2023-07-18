import { MigrationInterface, QueryRunner } from "typeorm"

export class addTableProductShippingProfile1680857773273
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        alter table money_amount
            drop constraint "FK_17a06d728e4cfbc5bd2ddb70af0";
      `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "money_amount" ADD CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE cascade ON UPDATE NO ACTION
    `)
  }
}
