import { MigrationInterface, QueryRunner } from "typeorm"

export class orderEditing1663059812399 implements MigrationInterface {
  name = "orderEditing1663059812399"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "order_item_change_type_enum" AS ENUM('item_add', 'item_remove', 'item_update')`
    )
    await queryRunner.query(
      `CREATE TABLE "order_item_change" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" "order_item_change_type_enum" NOT NULL, "order_edit_id" character varying NOT NULL, "original_line_item_id" character varying, "line_item_id" character varying, CONSTRAINT "UQ_da93cee3ca0dd50a5246268c2e9" UNIQUE ("order_edit_id", "line_item_id"), CONSTRAINT "UQ_5b7a99181e4db2ea821be0b6196" UNIQUE ("order_edit_id", "original_line_item_id"), CONSTRAINT "REL_5f9688929761f7df108b630e64" UNIQUE ("line_item_id"), CONSTRAINT "PK_d6eb138f77ffdee83567b85af0c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "order_edit" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "order_id" character varying NOT NULL, "internal_note" character varying, "created_by" character varying NOT NULL, "requested_by" character varying, "requested_at" TIMESTAMP WITH TIME ZONE, "confirmed_by" character varying, "confirmed_at" TIMESTAMP WITH TIME ZONE, "declined_by" character varying, "declined_reason" character varying, "declined_at" TIMESTAMP WITH TIME ZONE, "canceled_by" character varying, "canceled_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_58ab6acf2e84b4e827f5f846f7a" PRIMARY KEY ("id"))`
    )

    await queryRunner.query(
      `ALTER TABLE "order_item_change" ADD CONSTRAINT "FK_44feeebb258bf4cfa4cc4202281" FOREIGN KEY ("order_edit_id") REFERENCES "order_edit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item_change" ADD CONSTRAINT "FK_b4d53b8d03c9f5e7d4317e818d9" FOREIGN KEY ("original_line_item_id") REFERENCES "line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item_change" ADD CONSTRAINT "FK_5f9688929761f7df108b630e64a" FOREIGN KEY ("line_item_id") REFERENCES "line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_edit" ADD CONSTRAINT "FK_1f3a251488a91510f57e1bf93cd" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_edit" DROP CONSTRAINT "FK_1f3a251488a91510f57e1bf93cd"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item_change" DROP CONSTRAINT "FK_5f9688929761f7df108b630e64a"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item_change" DROP CONSTRAINT "FK_b4d53b8d03c9f5e7d4317e818d9"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item_change" DROP CONSTRAINT "FK_44feeebb258bf4cfa4cc4202281"`
    )

    await queryRunner.query(`DROP TABLE "order_edit"`)
    await queryRunner.query(`DROP TABLE "order_item_change"`)
    await queryRunner.query(`DROP TYPE "order_item_change_type_enum"`)
  }
}
