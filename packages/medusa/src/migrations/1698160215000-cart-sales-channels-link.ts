import { MigrationInterface, QueryRunner } from "typeorm"
import SalesChannelFeatureFlag from "../loaders/feature-flags/sales-channels"

export const featureFlag = SalesChannelFeatureFlag.key

export class CartSalesChannelsLink1698160215000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "cart_sales_channel"
        (
            "id"                character varying        NOT NULL,
            "cart_id"           character varying        NOT NULL,
            "sales_channel_id"  character varying        NOT NULL,
            "created_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at"        TIMESTAMP WITH TIME ZONE,
                                              CONSTRAINT "cart_sales_channel_pk"              PRIMARY KEY ("id"),
            CONSTRAINT "cart_sales_channel_cart_id_unique"  UNIQUE ("cart_id"),
            CONSTRAINT "cart_sales_channel_cart_id_sales_channel_id_unique"  UNIQUE ("cart_id", "sales_channel_id")
            );

        insert into "cart_sales_channel" (id, cart_id, sales_channel_id)
            (select 'cartsc_' || substr(md5(random()::text), 0, 27), id, sales_channel_id from "cart" WHERE sales_channel_id IS NOT NULL);

        ALTER TABLE "cart" DROP CONSTRAINT IF EXISTS "FK_a2bd3c26f42e754b9249ba78fd6";
        ALTER TABLE "cart" DROP COLUMN IF EXISTS "sales_channel_id";
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "cart" ADD COLUMN IF NOT EXISTS "sales_channel_id" CHARACTER VARYING;

        UPDATE "cart" SET "sales_channel_id" = "cart_sales_channel"."sales_channel_id"
            FROM "cart_sales_channel"
        WHERE "cart"."id" = "cart_sales_channel"."cart_id";

        DROP TABLE IF EXISTS "cart_sales_channel";

        ALTER TABLE "cart" ADD CONSTRAINT "FK_a2bd3c26f42e754b9249ba78fd6" FOREIGN KEY ("sales_channel_id") REFERENCES "sales_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `)
  }
}
