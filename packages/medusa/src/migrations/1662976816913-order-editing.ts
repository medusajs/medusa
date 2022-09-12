import { MigrationInterface, QueryRunner } from "typeorm"

export class orderEditing1662976816913 implements MigrationInterface {
  name = "orderEditing1662976816913"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "order_item_change_type_enum" AS ENUM('item_add', 'item_remove', 'quantity_change')`
    )
    await queryRunner.query(
      `CREATE TABLE "order_item_change" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" "public"."order_item_change_type_enum", "original_line_item_id" character varying, "line_item_id" character varying, "orderEditId" character varying, CONSTRAINT "REL_b4d53b8d03c9f5e7d4317e818d" UNIQUE ("original_line_item_id"), CONSTRAINT "REL_5f9688929761f7df108b630e64" UNIQUE ("line_item_id"), CONSTRAINT "PK_d6eb138f77ffdee83567b85af0c" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "order_edit" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "internal_note" character varying, "created_by" character varying NOT NULL, "requested_by" character varying, "requested_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "confirmed_by" character varying, "confirmed_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "declined_by" character varying, "declined_reason" character varying, "declined_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "canceled_by" character varying, "canceled_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "order_id" character varying, CONSTRAINT "PK_58ab6acf2e84b4e827f5f846f7a" PRIMARY KEY ("id"))`
    )

    await queryRunner.query(
      `ALTER TABLE "order_item_change" ADD CONSTRAINT "FK_a3851ad9d890e2265ba878c5eef" FOREIGN KEY ("orderEditId") REFERENCES "order_edit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
    await queryRunner.query(
      `ALTER TABLE "order_edit" ADD CONSTRAINT "FK_fe2a275ff60947aad4b8d663bdd" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_edit" ADD CONSTRAINT "FK_62b7765bab66da06a02bb07e195" FOREIGN KEY ("canceled_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_edit" DROP CONSTRAINT "FK_62b7765bab66da06a02bb07e195"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_edit" DROP CONSTRAINT "FK_fe2a275ff60947aad4b8d663bdd"`
    )
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
      `ALTER TABLE "order_item_change" DROP CONSTRAINT "FK_a3851ad9d890e2265ba878c5eef"`
    )

    await queryRunner.query(`DROP TABLE "order_edit"`)
    await queryRunner.query(`DROP TABLE "order_item_change"`)
    await queryRunner.query(`DROP TYPE "order_item_change_type_enum"`)
  }
}
