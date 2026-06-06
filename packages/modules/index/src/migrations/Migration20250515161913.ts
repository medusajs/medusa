import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250515161913 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
        DO $$
        DECLARE
            r RECORD;
            protected_tables TEXT[] := ARRAY[
                'cat_linkproductsaleschannel',
                'cat_linkproductvariantpriceset',
                'cat_price',
                'cat_priceset',
                'cat_product',
                'cat_productvariant',
                'cat_saleschannel',
                'cat_pivot_linkproductsaleschannelsaleschannel',
                'cat_pivot_linkproductvariantpricesetpriceset',
                'cat_pivot_pricesetprice',
                'cat_pivot_productlinkproductsaleschannel',
                'cat_pivot_productproductvariant',
                'cat_pivot_productvariantlinkproductvariantpriceset'
            ];
        BEGIN
            FOR r IN
                SELECT tablename
                FROM pg_tables
                WHERE schemaname = 'public' AND tablename LIKE 'cat\_%'
            LOOP
                IF r.tablename <> ALL (protected_tables) THEN
                    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE;', r.tablename);
                END IF;
            END LOOP;
        END $$;

        UPDATE index_sync SET last_key = NULL WHERE entity NOT IN (
          'Product',
          'ProductVariant',
          'LinkProductVariantPriceSet',
          'LinkProductSalesChannel',
          'Price',
          'PriceSet',
          'SalesChannel'
        );

        UPDATE index_metadata SET status = 'pending' WHERE entity NOT IN (
          'Product',
          'ProductVariant',
          'LinkProductVariantPriceSet',
          'LinkProductSalesChannel',
          'Price',
          'PriceSet',
        'SalesChannel'
        );
    `)
  }

  override async down(): Promise<void> {}
}
