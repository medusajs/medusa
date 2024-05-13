import { generatePostgresAlterColummnIfExistStatement } from "@medusajs/utils"
import { Migration } from "@mikro-orm/migrations"

export class Migration20240219102530 extends Migration {
  async up(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS "order_address" (
          "id" TEXT NOT NULL,
          "customer_id" TEXT NULL,
          "company" TEXT NULL,
          "first_name" TEXT NULL,
          "last_name" TEXT NULL,
          "address_1" TEXT NULL,
          "address_2" TEXT NULL,
          "city" TEXT NULL,
          "country_code" TEXT NULL,
          "province" TEXT NULL,
          "postal_code" TEXT NULL,
          "phone" TEXT NULL,
          "metadata" JSONB NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          CONSTRAINT "order_address_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_address_customer_id" ON "order_address" (
          customer_id
      );

      CREATE TABLE IF NOT EXISTS "order" (
          "id" TEXT NOT NULL,
          "region_id" TEXT NULL,
          "display_id" SERIAL,
          "customer_id" TEXT NULL,
          "version" INTEGER NOT NULL DEFAULT 1,
          "sales_channel_id" TEXT NULL,
          "status" text NOT NULL,
          "is_draft_order" BOOLEAN NOT NULL DEFAULT false,
          "email" text NULL,
          "currency_code" text NOT NULL,
          "shipping_address_id" text NULL,
          "billing_address_id" text NULL,
          "no_notification" boolean NULL,
          "metadata" jsonb NULL,
          "created_at" timestamptz NOT NULL DEFAULT now(),
          "updated_at" timestamptz NOT NULL DEFAULT now(),
          "deleted_at" timestamptz NULL,
          "canceled_at" timestamptz NULL,
          CONSTRAINT "order_pkey" PRIMARY KEY ("id")
      );

      ALTER TABLE "order"
      ADD COLUMN if NOT exists "deleted_at" timestamptz NULL;

      ALTER TABLE "order"
      ADD COLUMN if NOT exists "is_draft_order" BOOLEAN NOT NULL DEFAULT false;
      
      ALTER TABLE "order"
      ADD COLUMN if NOT exists "version" INTEGER NOT NULL DEFAULT 1;


      ALTER TABLE "order" ALTER COLUMN status TYPE text;
      DROP TYPE IF EXISTS  order_status_enum CASCADE;
      CREATE TYPE order_status_enum AS ENUM (
        'pending',
        'completed',
        'draft',
        'archived',
        'canceled',
        'requires_action'
      );
      ALTER TABLE "order" ALTER COLUMN status DROP DEFAULT;
      ALTER TABLE "order" ALTER COLUMN status TYPE order_status_enum USING (status::text::order_status_enum);
	  ALTER TABLE "order" ALTER COLUMN status SET DEFAULT 'pending';
    

      ALTER TABLE "order" DROP constraint if EXISTS "FK_6ff7e874f01b478c115fdd462eb" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "FK_19b0c6293443d1b464f604c3316" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "FK_717a141f96b76d794d409f38129" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "FK_727b872f86c7378474a8fa46147" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "FK_5568d3b9ce9f7abeeb37511ecf2" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "FK_c99a206eb11ad45f6b7f04f2dcc" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "FK_cd7812c96209c5bdd48a6b858b0" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "FK_e1fcce2b18dbcdbe0a5ba9a68b8" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "REL_c99a206eb11ad45f6b7f04f2dc" CASCADE;

      ALTER TABLE "order" DROP constraint if EXISTS "UQ_727b872f86c7378474a8fa46147" CASCADE;

      DROP INDEX if exists "IDX_19b0c6293443d1b464f604c331";

      DROP INDEX if exists "IDX_579e01fb94f4f58db480857e05";

      DROP INDEX if exists "IDX_5568d3b9ce9f7abeeb37511ecf";

      DROP INDEX if exists "IDX_c99a206eb11ad45f6b7f04f2dc";

      DROP INDEX if exists "IDX_cd7812c96209c5bdd48a6b858b";

      DROP INDEX if exists "IDX_e1fcce2b18dbcdbe0a5ba9a68b";

      ${generatePostgresAlterColummnIfExistStatement(
        "order",
        ["fulfillment_status", "payment_status", "display_id"],
        "DROP NOT NULL"
      )}

      CREATE INDEX IF NOT EXISTS "IDX_order_display_id" ON "order" (
          display_id
      ) 
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_region_id" ON "order" (
          region_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_customer_id" ON "order" (
          customer_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_customer_id" ON "order" (
          customer_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_currency_code" ON "order" (
          currency_code
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_shipping_address_id" ON "order" (
          shipping_address_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_billing_address_id" ON "order" (
          billing_address_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_deleted_at" ON "order" (
          deleted_at
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_is_draft_order" ON "order" (
          is_draft_order
      )
      WHERE deleted_at IS NOT NULL;


      CREATE TABLE IF NOT EXISTS "order_summary" (
          "id" TEXT NOT NULL,
          "order_id" TEXT NOT NULL,
          "version" INTEGER NOT NULL DEFAULT 1,
          "totals" JSONB NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "deleted_at" timestamptz NULL,
          CONSTRAINT "order_summary_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_summary_order_id_version" ON "order_summary" (
          order_id,
          version
      )
      WHERE deleted_at IS NOT NULL;

      CREATE TABLE IF NOT EXISTS "order_change" (
          "id" TEXT NOT NULL,
          "order_id" TEXT NOT NULL,
          "version" INTEGER NOT NULL,
          "description" TEXT NULL,
          "status" text check (
              "status" IN (
                  'confirmed',
                  'declined',
                  'requested',
                  'pending',
                  'canceled'
              )
          ) NOT NULL DEFAULT 'pending',
          "internal_note" text NULL,
          "created_by" text NULL,
          "requested_by" text NULL,
          "requested_at" timestamptz NULL,
          "confirmed_by" text NULL,
          "confirmed_at" timestamptz NULL,
          "declined_by" text NULL,
          "declined_reason" text NULL,
          "metadata" jsonb NULL,
          "declined_at" timestamptz NULL,
          "canceled_by" text NULL,
          "canceled_at" timestamptz NULL,
          "created_at" timestamptz NOT NULL DEFAULT now(),
          "updated_at" timestamptz NOT NULL DEFAULT now(),
          CONSTRAINT "order_change_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_change_order_id" ON "order_change" (
          order_id
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_change_order_id_version" ON "order_change" (
          order_id,
          version
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_change_status" ON "order_change" (status);

      CREATE TABLE IF NOT EXISTS "order_change_action" (
          "id" TEXT NOT NULL,
          "order_id" TEXT NULL,
          "version" INTEGER NULL,
          "ordering" BIGSERIAL NOT NULL,
          "order_change_id" TEXT NULL,
          "reference" TEXT NULL,
          "reference_id" TEXT NULL,
          "action" TEXT NOT NULL,
          "details" JSONB NULL,
          "amount" NUMERIC NULL,
          "raw_amount" JSONB NULL,
          "internal_note" TEXT NULL,
          "applied" BOOLEAN NOT NULL DEFAULT false,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          CONSTRAINT "order_change_action_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_change_action_order_change_id" ON "order_change_action" (
          order_change_id
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_change_action_order_id" ON "order_change_action" (
          order_id
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_change_action_ordering" ON "order_change_action" (
          ordering
      );

      CREATE TABLE IF NOT EXISTS "order_item" (
          "id" TEXT NOT NULL,
          "order_id" TEXT NOT NULL,
          "version" INTEGER NOT NULL,
          "item_id" TEXT NOT NULL,
          "quantity" NUMERIC NOT NULL,
          "raw_quantity" JSONB NOT NULL,
          "fulfilled_quantity" NUMERIC NOT NULL,
          "raw_fulfilled_quantity" JSONB NOT NULL,
          "shipped_quantity" NUMERIC NOT NULL,
          "raw_shipped_quantity" JSONB NOT NULL,
          "return_requested_quantity" NUMERIC NOT NULL,
          "raw_return_requested_quantity" JSONB NOT NULL,
          "return_received_quantity" NUMERIC NOT NULL,
          "raw_return_received_quantity" JSONB NOT NULL,
          "return_dismissed_quantity" NUMERIC NOT NULL,
          "raw_return_dismissed_quantity" JSONB NOT NULL,
          "written_off_quantity" NUMERIC NOT NULL,
          "raw_written_off_quantity" JSONB NOT NULL,
          "metadata" JSONB NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "deleted_at" timestamptz NULL,
          CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_item_order_id" ON "order_item" (
          order_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_item_order_id_version" ON "order_item" (
          order_id,
          version
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_item_item_id" ON "order_item" (
          item_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE TABLE IF NOT EXISTS "order_shipping" (
          "id" TEXT NOT NULL,
          "order_id" TEXT NOT NULL,
          "version" INTEGER NOT NULL,
          "shipping_method_id" TEXT NOT NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "deleted_at" timestamptz NULL,
          CONSTRAINT "order_shipping_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_shipping_order_id" ON "order_shipping" (
          order_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_shipping_order_id_version" ON "order_shipping" (
          order_id,
          version
      )
      WHERE deleted_at IS NOT NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_shipping_item_id" ON "order_shipping" (
          shipping_method_id
      )
      WHERE deleted_at IS NOT NULL;

      CREATE TABLE IF NOT EXISTS "order_line_item" (
          "id" TEXT NOT NULL,
          "totals_id" TEXT NULL,
          "title" TEXT NOT NULL,
          "subtitle" TEXT NULL,
          "thumbnail" TEXT NULL,
          "variant_id" TEXT NULL,
          "product_id" TEXT NULL,
          "product_title" TEXT NULL,
          "product_description" TEXT NULL,
          "product_subtitle" TEXT NULL,
          "product_type" TEXT NULL,
          "product_collection" TEXT NULL,
          "product_handle" TEXT NULL,
          "variant_sku" TEXT NULL,
          "variant_barcode" TEXT NULL,
          "variant_title" TEXT NULL,
          "variant_option_values" JSONB NULL,
          "requires_shipping" BOOLEAN NOT NULL DEFAULT true,
          "is_discountable" BOOLEAN NOT NULL DEFAULT true,
          "is_tax_inclusive" BOOLEAN NOT NULL DEFAULT false,
          "compare_at_unit_price" NUMERIC NULL,
          "raw_compare_at_unit_price" JSONB NULL,
          "unit_price" NUMERIC NOT NULL,
          "raw_unit_price" JSONB NOT NULL,
          "metadata" JSONB NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          CONSTRAINT "order_line_item_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_line_item_variant_id" ON "order_line_item" (
          variant_id
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_line_item_product_id" ON "order_line_item" (
          product_id
      );

      CREATE TABLE IF NOT EXISTS "order_line_item_tax_line" (
          "id" TEXT NOT NULL,
          "description" TEXT NULL,
          "tax_rate_id" TEXT NULL,
          "code" TEXT NOT NULL,
          "rate" NUMERIC NOT NULL,
          "raw_rate" JSONB NOT NULL,
          "provider_id" TEXT NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "item_id" TEXT NOT NULL,
          CONSTRAINT "order_line_item_tax_line_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_line_item_tax_line_item_id" ON "order_line_item_tax_line" (item_id);

      CREATE TABLE IF NOT EXISTS "order_line_item_adjustment" (
          "id" TEXT NOT NULL,
          "description" TEXT NULL,
          "promotion_id" TEXT NULL,
          "code" TEXT NULL,
          "amount" NUMERIC NOT NULL,
          "raw_amount" JSONB NOT NULL,
          "provider_id" TEXT NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "item_id" TEXT NOT NULL,
          CONSTRAINT "order_line_item_adjustment_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_line_item_adjustment_item_id" ON "order_line_item_adjustment" (item_id);

      CREATE TABLE IF NOT EXISTS "order_shipping_method" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" JSONB NULL,
          "amount" NUMERIC NOT NULL,
          "raw_amount" JSONB NOT NULL,
          "is_tax_inclusive" BOOLEAN NOT NULL DEFAULT false,
          "shipping_option_id" TEXT NULL,
          "data" JSONB NULL,
          "metadata" JSONB NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          CONSTRAINT "order_shipping_method_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_shipping_method_shipping_option_id" ON "order_shipping_method" (
          shipping_option_id
      );

      CREATE TABLE IF NOT EXISTS "order_shipping_method_adjustment" (
          "id" TEXT NOT NULL,
          "description" TEXT NULL,
          "promotion_id" TEXT NULL,
          "code" TEXT NULL,
          "amount" NUMERIC NOT NULL,
          "raw_amount" JSONB NOT NULL,
          "provider_id" TEXT NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "shipping_method_id" TEXT NOT NULL,
          CONSTRAINT "order_shipping_method_adjustment_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_shipping_method_adjustment_shipping_method_id" ON "order_shipping_method_adjustment" (
          shipping_method_id
      );

      CREATE TABLE IF NOT EXISTS "order_shipping_method_tax_line" (
          "id" TEXT NOT NULL,
          "description" TEXT NULL,
          "tax_rate_id" TEXT NULL,
          "code" TEXT NOT NULL,
          "rate" NUMERIC NOT NULL,
          "raw_rate" JSONB NOT NULL,
          "provider_id" TEXT NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "shipping_method_id" TEXT NOT NULL,
          CONSTRAINT "order_shipping_method_tax_line_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_shipping_method_tax_line_shipping_method_id" ON "order_shipping_method_tax_line" (
          shipping_method_id
      );

      CREATE TABLE IF NOT EXISTS "order_transaction" (
          "id" TEXT NOT NULL,
          "order_id" TEXT NOT NULL,
          "amount" NUMERIC NOT NULL,
          "raw_amount" JSONB NOT NULL,
          "currency_code" TEXT NOT NULL,
          "reference" TEXT NULL,
          "reference_id" TEXT NULL,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT Now(),
          CONSTRAINT "order_transaction_pkey" PRIMARY KEY ("id")
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_transaction_order_id" ON "order_transaction" (
          order_id
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_transaction_currency_code" ON "order_transaction" (
          currency_code
      );

      CREATE INDEX IF NOT EXISTS "IDX_order_transaction_reference_id" ON "order_transaction" (
          reference_id
      );
      
      CREATE TABLE IF NOT EXISTS "return_reason"
      (
          id character varying NOT NULL,
          value character varying NOT NULL,
          label character varying NOT NULL,
          description character varying, 
          metadata JSONB NULL,
          parent_return_reason_id character varying,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          deleted_at timestamp with time zone,
          CONSTRAINT "return_reason_pkey" PRIMARY KEY (id),
          CONSTRAINT "return_reason_parent_return_reason_id_foreign" FOREIGN KEY (parent_return_reason_id)
              REFERENCES "return_reason" (id) MATCH SIMPLE
              ON UPDATE NO ACTION
              ON DELETE NO ACTION
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_return_reason_value" ON "return_reason" USING btree (value ASC NULLS LAST)
      WHERE deleted_at IS NOT NULL;


      ALTER TABLE if exists "order"
      ADD CONSTRAINT "order_shipping_address_id_foreign" FOREIGN KEY ("shipping_address_id") REFERENCES "order_address" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order"
      ADD CONSTRAINT "order_billing_address_id_foreign" FOREIGN KEY ("billing_address_id") REFERENCES "order_address" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_change"
      ADD CONSTRAINT "order_change_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_change_action"
      ADD CONSTRAINT "order_change_action_order_change_id_foreign" FOREIGN KEY ("order_change_id") REFERENCES "order_change" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_item"
      ADD CONSTRAINT "order_item_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_item"
      ADD CONSTRAINT "order_item_item_id_foreign" FOREIGN KEY ("item_id") REFERENCES "order_line_item" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_line_item"
      ADD CONSTRAINT "order_line_item_totals_id_foreign" FOREIGN KEY ("totals_id") REFERENCES "order_item" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_line_item_tax_line"
      ADD CONSTRAINT "order_line_item_tax_line_item_id_foreign" FOREIGN KEY ("item_id") REFERENCES "order_line_item" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_line_item_adjustment"
      ADD CONSTRAINT "order_line_item_adjustment_item_id_foreign" FOREIGN KEY ("item_id") REFERENCES "order_line_item" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_shipping"
      ADD CONSTRAINT "order_shipping_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_shipping_method_adjustment"
      ADD CONSTRAINT "order_shipping_method_adjustment_shipping_method_id_foreign" FOREIGN KEY ("shipping_method_id") REFERENCES "order_shipping_method" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_shipping_method_tax_line"
      ADD CONSTRAINT "order_shipping_method_tax_line_shipping_method_id_foreign" FOREIGN KEY ("shipping_method_id") REFERENCES "order_shipping_method" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;

      ALTER TABLE if exists "order_transaction"
      ADD CONSTRAINT "order_transaction_order_id_foreign" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON
      UPDATE CASCADE ON
      DELETE CASCADE;
    `

    this.addSql(sql)
  }
}
