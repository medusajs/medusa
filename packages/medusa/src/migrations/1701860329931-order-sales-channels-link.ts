import { MigrationInterface, QueryRunner } from "typeorm"

import SalesChannelFeatureFlag from "../loaders/feature-flags/sales-channels"

export const featureFlag = [SalesChannelFeatureFlag.key]

export class OrderSalesChannelLink1701860329931 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "order_sales_channel"
        (
            "id"                character varying        NOT NULL,
            "order_id"          character varying        NOT NULL,
            "sales_channel_id"  character varying        NOT NULL,
            "created_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at"        TIMESTAMP WITH TIME ZONE,
                                CONSTRAINT "order_sales_channel_pk" PRIMARY KEY ("order_id", "sales_channel_id"),
                                CONSTRAINT "order_sales_channel_order_id_unique"  UNIQUE ("order_id")
            );
        CREATE INDEX IF NOT EXISTS "IDX_id_order_sales_channel" ON "order_sales_channel" ("id");

        insert into "order_sales_channel" (id, order_id, sales_channel_id)
            (select 'ordersc_' || substr(md5(random()::text), 0, 27), id, sales_channel_id from "order" WHERE sales_channel_id IS NOT NULL);

        ALTER TABLE "order" DROP CONSTRAINT IF EXISTS "FK_6ff7e874f01b478c115fdd462eb";
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE "order" 
            SET "sales_channel_id" = "order_sales_channel"."sales_channel_id"
            FROM "order_sales_channel"
            WHERE "order"."id" = "order_sales_channel"."order_id";

        DROP TABLE IF EXISTS "order_sales_channel";

        ALTER TABLE "order" ADD CONSTRAINT "FK_6ff7e874f01b478c115fdd462eb" FOREIGN KEY ("sales_channel_id") REFERENCES "sales_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `)
  }
}
