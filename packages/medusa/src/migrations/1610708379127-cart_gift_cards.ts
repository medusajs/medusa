import { MigrationInterface, QueryRunner } from "typeorm"

export class cartGiftCards1610708379127 implements MigrationInterface {
  name = "cartGiftCards1610708379127"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart_gift_cards" ("cart_id" character varying NOT NULL, "gift_card_id" character varying NOT NULL, CONSTRAINT "PK_2389be82bf0ef3635e2014c9ef1" PRIMARY KEY ("cart_id", "gift_card_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d38047a90f3d42f0be7909e8ae" ON "cart_gift_cards" ("cart_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0fb38b6d167793192bc126d835" ON "cart_gift_cards" ("gift_card_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "cart_gift_cards" ADD CONSTRAINT "FK_d38047a90f3d42f0be7909e8aea" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "cart_gift_cards" ADD CONSTRAINT "FK_0fb38b6d167793192bc126d835e" FOREIGN KEY ("gift_card_id") REFERENCES "gift_card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_gift_cards" DROP CONSTRAINT "FK_0fb38b6d167793192bc126d835e"`
    )
    await queryRunner.query(
      `ALTER TABLE "cart_gift_cards" DROP CONSTRAINT "FK_d38047a90f3d42f0be7909e8aea"`
    )
    await queryRunner.query(`DROP INDEX "IDX_0fb38b6d167793192bc126d835"`)
    await queryRunner.query(`DROP INDEX "IDX_d38047a90f3d42f0be7909e8ae"`)
    await queryRunner.query(`DROP TABLE "cart_gift_cards"`)
    await queryRunner.query(
      `ALTER TABLE "swap" ADD CONSTRAINT "FK_ebd3e02011ca6e072302e569d52" FOREIGN KEY ("return_id") REFERENCES "return"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
