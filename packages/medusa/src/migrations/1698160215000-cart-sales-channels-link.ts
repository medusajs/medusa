import { MigrationInterface, QueryRunner } from "typeorm"
import IsolateSalesChannelDomainFeatureFlag from "../loaders/feature-flags/isolate-sales-channel-domain"

export const featureFlag = IsolateSalesChannelDomainFeatureFlag.key

export class CartSalesChannelsLink1698160215000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "cart_sales_channel"
        (
            "id"                character varying        NOT NULL,
            "cart_id"           character varying        NOT NULL,
            "sales_channel_id"  character varying,
            "created_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at"        TIMESTAMP WITH TIME ZONE,
            CONSTRAINT "cart_sales_channel_pk"              PRIMARY KEY ("id"),
            CONSTRAINT "cart_sales_channel_cart_id_unique"  UNIQUE ("cart_id")
            );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "cart_sales_channel";
    `)
  }
}
