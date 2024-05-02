import { Migration } from "@mikro-orm/migrations"

export class Migration20240222170223 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
      CREATE TABLE IF NOT EXISTS "cart" (
        "id" TEXT NOT NULL,
        "region_id" TEXT NULL,
        "customer_id" TEXT NULL,
        "sales_channel_id" TEXT NULL,
        "email" TEXT NULL,
        "currency_code" TEXT NOT NULL,
        "shipping_address_id" TEXT NULL,
        "billing_address_id" TEXT NULL,
        "metadata" JSONB NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ NULL,
        CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
    );
    
    ALTER TABLE "cart" ADD COLUMN IF NOT EXISTS "currency_code" TEXT NOT NULL;
    ALTER TABLE "cart" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ NULL;
    ALTER TABLE "cart" ALTER COLUMN "region_id" DROP NOT NULL;
    ALTER TABLE "cart" ALTER COLUMN "email" DROP NOT NULL;
    
    ALTER TABLE "cart" DROP CONSTRAINT IF EXISTS "FK_242205c81c1152fab1b6e848470";
    ALTER TABLE "cart" DROP CONSTRAINT IF EXISTS "FK_484c329f4783be4e18e5e2ff090";
    ALTER TABLE "cart" DROP CONSTRAINT IF EXISTS "FK_6b9c66b5e36f7c827dfaa092f94";
    ALTER TABLE "cart" DROP CONSTRAINT IF EXISTS "FK_9d1a161434c610aae7c3df2dc7e";
    ALTER TABLE "cart" DROP CONSTRAINT IF EXISTS "FK_a2bd3c26f42e754b9249ba78fd6";
    ALTER TABLE "cart" DROP CONSTRAINT IF EXISTS "FK_ced15a9a695d2b5db9dabce763d";
    
    CREATE INDEX IF NOT EXISTS "IDX_cart_customer_id" ON "cart" ("customer_id") WHERE deleted_at IS NULL AND customer_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_shipping_address_id" ON "cart" ("shipping_address_id") WHERE deleted_at IS NULL AND shipping_address_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_billing_address_id" ON "cart" ("billing_address_id") WHERE deleted_at IS NULL AND billing_address_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_region_id" ON "cart" ("region_id") WHERE deleted_at IS NULL AND region_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_sales_channel_id" ON "cart" ("sales_channel_id") WHERE deleted_at IS NULL AND sales_channel_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_currency_code" ON "cart" ("currency_code");
    
    CREATE TABLE IF NOT EXISTS "cart_address" (
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
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "deleted_at" TIMESTAMPTZ NULL,
      CONSTRAINT "cart_address_pkey" PRIMARY KEY ("id")
    );
    
    CREATE TABLE IF NOT EXISTS "cart_line_item" (
      "id" TEXT NOT NULL,
      "cart_id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "subtitle" TEXT NULL,
      "thumbnail" TEXT NULL,
      "quantity" INTEGER NOT NULL,
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
      "requires_shipping" BOOLEAN NOT NULL DEFAULT TRUE,
      "is_discountable" BOOLEAN NOT NULL DEFAULT TRUE,
      "is_tax_inclusive" BOOLEAN NOT NULL DEFAULT FALSE,
      "compare_at_unit_price" NUMERIC NULL,
      "raw_compare_at_unit_price" JSONB NULL,
      "unit_price" NUMERIC NOT NULL,
      "raw_unit_price" JSONB NOT NULL,
      "metadata" JSONB NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "deleted_at" TIMESTAMPTZ NULL,
      CONSTRAINT "cart_line_item_pkey" PRIMARY KEY ("id"),
      CONSTRAINT cart_line_item_unit_price_check CHECK (unit_price >= 0)
    );
    
    ALTER TABLE "cart" ADD CONSTRAINT "cart_shipping_address_id_foreign" FOREIGN KEY ("shipping_address_id") REFERENCES "cart_address" ("id") ON UPDATE CASCADE ON DELETE SET NULL;
    ALTER TABLE "cart" ADD CONSTRAINT "cart_billing_address_id_foreign" FOREIGN KEY ("billing_address_id") REFERENCES "cart_address" ("id") ON UPDATE CASCADE ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS "IDX_line_item_cart_id" ON "cart_line_item" ("cart_id") WHERE deleted_at IS NULL;
    CREATE INDEX IF NOT EXISTS "IDX_line_item_product_id" ON "cart_line_item" ("product_id") WHERE deleted_at IS NULL AND product_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_line_item_variant_id" ON "cart_line_item" ("variant_id") WHERE deleted_at IS NULL AND variant_id IS NOT NULL;
    
    
    CREATE TABLE IF NOT EXISTS "cart_line_item_adjustment" (
        "id" TEXT NOT NULL,
        "description" TEXT NULL,
        "promotion_id" TEXT NULL,
        "code" TEXT NULL,
        "amount" NUMERIC NOT NULL,
        "raw_amount" JSONB NOT NULL,
        "provider_id" TEXT NULL,
        "metadata" JSONB NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ NULL,
        "item_id" TEXT NULL,
        CONSTRAINT "cart_line_item_adjustment_pkey" PRIMARY KEY ("id"),
        CONSTRAINT cart_line_item_adjustment_check CHECK (amount >= 0)
    );
    
    CREATE INDEX IF NOT EXISTS "IDX_adjustment_item_id" ON "cart_line_item_adjustment" ("item_id") WHERE deleted_at IS NULL;
    CREATE INDEX IF NOT EXISTS "IDX_line_item_adjustment_promotion_id" ON "cart_line_item_adjustment" ("promotion_id") WHERE deleted_at IS NULL AND promotion_id IS NOT NULL;
    
    CREATE TABLE IF NOT EXISTS "cart_line_item_tax_line" (
      "id" TEXT NOT NULL,
      "description" TEXT NULL,
      "tax_rate_id" TEXT NULL,
      "code" TEXT NOT NULL,
      "rate" NUMERIC NOT NULL,
      "provider_id" TEXT NULL,
      "metadata" JSONB NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "deleted_at" TIMESTAMPTZ NULL,
      "item_id" TEXT NULL,
      CONSTRAINT "cart_line_item_tax_line_pkey" PRIMARY KEY ("id")
  );
    
    CREATE INDEX IF NOT EXISTS "IDX_tax_line_item_id" ON "cart_line_item_tax_line" ("item_id") WHERE deleted_at IS NULL;
    CREATE INDEX IF NOT EXISTS "IDX_line_item_tax_line_tax_rate_id" ON "cart_line_item_tax_line" ("tax_rate_id") WHERE deleted_at IS NULL AND tax_rate_id IS NOT NULL;
    
    CREATE TABLE IF NOT EXISTS "cart_shipping_method" (
      "id" TEXT NOT NULL,
      "cart_id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" JSONB NULL,
      "amount" NUMERIC NOT NULL,
      "raw_amount" JSONB NOT NULL,
      "is_tax_inclusive" BOOLEAN NOT NULL DEFAULT FALSE,
      "shipping_option_id" TEXT NULL,
      "data" JSONB NULL,
      "metadata" JSONB NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "deleted_at" TIMESTAMPTZ NULL,
      CONSTRAINT "cart_shipping_method_pkey" PRIMARY KEY ("id"),
      CONSTRAINT cart_shipping_method_check CHECK (amount >= 0)
  );
    
    CREATE INDEX IF NOT EXISTS "IDX_shipping_method_cart_id" ON "cart_shipping_method" ("cart_id") WHERE deleted_at IS NULL;
    CREATE INDEX IF NOT EXISTS "IDX_shipping_method_option_id" ON "cart_shipping_method" ("shipping_option_id") WHERE deleted_at IS NULL AND shipping_option_id IS NOT NULL;

    CREATE TABLE IF NOT EXISTS "cart_shipping_method_adjustment" (
      "id" TEXT NOT NULL,
      "description" TEXT NULL,
      "promotion_id" TEXT NULL,
      "code" TEXT NULL,
      "amount" NUMERIC NOT NULL,
      "raw_amount" JSONB NOT NULL,
      "provider_id" TEXT NULL,
      "metadata" JSONB NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "deleted_at" TIMESTAMPTZ NULL,
      "shipping_method_id" TEXT NULL,
      CONSTRAINT "cart_shipping_method_adjustment_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "IDX_adjustment_shipping_method_id" ON "cart_shipping_method_adjustment" ("shipping_method_id") WHERE deleted_at IS NULL;
    CREATE INDEX IF NOT EXISTS "IDX_shipping_method_adjustment_promotion_id" ON "cart_shipping_method_adjustment" ("promotion_id") WHERE deleted_at IS NULL AND promotion_id IS NOT NULL;

    CREATE TABLE IF NOT EXISTS "cart_shipping_method_tax_line" (
      "id" TEXT NOT NULL,
      "description" TEXT NULL,
      "tax_rate_id" TEXT NULL,
      "code" TEXT NOT NULL,
      "rate" NUMERIC NOT NULL,
      "provider_id" TEXT NULL,
      "metadata" JSONB NULL,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "deleted_at" TIMESTAMPTZ NULL,
      "shipping_method_id" TEXT NULL,
      CONSTRAINT "cart_shipping_method_tax_line_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "IDX_tax_line_shipping_method_id" ON "cart_shipping_method_tax_line" ("shipping_method_id") WHERE deleted_at IS NULL;
    CREATE INDEX IF NOT EXISTS "IDX_shipping_method_tax_line_tax_rate_id" ON "cart_shipping_method_tax_line" ("tax_rate_id") WHERE deleted_at IS NULL AND tax_rate_id IS NOT NULL;

    ALTER TABLE "cart_line_item" ADD CONSTRAINT "cart_line_item_cart_id_foreign" FOREIGN KEY ("cart_id") REFERENCES "cart" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
    ALTER TABLE "cart_line_item_adjustment" ADD CONSTRAINT "cart_line_item_adjustment_item_id_foreign" FOREIGN KEY ("item_id") REFERENCES "cart_line_item" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
    ALTER TABLE "cart_line_item_tax_line" ADD CONSTRAINT "cart_line_item_tax_line_item_id_foreign" FOREIGN KEY ("item_id") REFERENCES "cart_line_item" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
    ALTER TABLE "cart_shipping_method" ADD CONSTRAINT "cart_shipping_method_cart_id_foreign" FOREIGN KEY ("cart_id") REFERENCES "cart" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
    ALTER TABLE "cart_shipping_method_adjustment" ADD CONSTRAINT "cart_shipping_method_adjustment_shipping_method_id_foreign" FOREIGN KEY ("shipping_method_id") REFERENCES "cart_shipping_method" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
    ALTER TABLE "cart_shipping_method_tax_line" ADD CONSTRAINT "cart_shipping_method_tax_line_shipping_method_id_foreign" FOREIGN KEY ("shipping_method_id") REFERENCES "cart_shipping_method" ("id") ON UPDATE CASCADE ON DELETE CASCADE;          

    CREATE INDEX IF NOT EXISTS "IDX_cart_deleted_at" ON "cart" (deleted_at) WHERE deleted_at IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_address_deleted_at" ON "cart_address" (deleted_at) WHERE deleted_at IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_line_item_adjustment_deleted_at" ON "cart_line_item_adjustment" (deleted_at) WHERE deleted_at IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_shipping_method_adjustment_deleted_at" ON "cart_shipping_method_adjustment" (deleted_at) WHERE deleted_at IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_line_item_tax_line_deleted_at" ON "cart_line_item_tax_line" (deleted_at) WHERE deleted_at IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_shipping_method_tax_line_deleted_at" ON "cart_shipping_method_tax_line" (deleted_at) WHERE deleted_at IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_shipping_method_deleted_at" ON "cart_shipping_method" (deleted_at) WHERE deleted_at IS NOT NULL;
    CREATE INDEX IF NOT EXISTS "IDX_cart_line_item_deleted_at" ON "cart_line_item" (deleted_at) WHERE deleted_at IS NOT NULL;
      `
    )
  }
}
