import { MigrationInterface, QueryRunner } from "typeorm"

export class restockNotification1617703530229 implements MigrationInterface {
  name = "restockNotification1617703530229"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "restock_notification" ("variant_id" character varying NOT NULL, "emails" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_49181ca04caac807fcec321705a" PRIMARY KEY ("variant_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "restock_notification" ADD CONSTRAINT "FK_49181ca04caac807fcec321705a" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "restock_notification" DROP CONSTRAINT "FK_49181ca04caac807fcec321705a"`
    )
    await queryRunner.query(`DROP TABLE "restock_notification"`)
  }
}
