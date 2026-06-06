import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241205095237 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "cart_line_item" drop constraint if exists "cart_line_item_cart_id_foreign";'
    )

    this.addSql(
      'alter table if exists "cart_line_item_adjustment" drop constraint if exists "cart_line_item_adjustment_item_id_foreign";'
    )

    this.addSql(
      'alter table if exists "cart_line_item_tax_line" drop constraint if exists "cart_line_item_tax_line_item_id_foreign";'
    )

    this.addSql(
      'alter table if exists "cart_shipping_method" drop constraint if exists "cart_shipping_method_cart_id_foreign";'
    )

    this.addSql(
      'alter table if exists "cart_line_item" alter column "requires_shipping" type boolean using ("requires_shipping"::boolean);'
    )
    this.addSql(
      'alter table if exists "cart_line_item" alter column "requires_shipping" set default true;'
    )
    this.addSql(
      'alter table if exists "cart_line_item" alter column "is_discountable" type boolean using ("is_discountable"::boolean);'
    )
    this.addSql(
      'alter table if exists "cart_line_item" alter column "is_discountable" set default true;'
    )
    this.addSql(
      'alter table if exists "cart_line_item" alter column "is_tax_inclusive" type boolean using ("is_tax_inclusive"::boolean);'
    )
    this.addSql(
      'alter table if exists "cart_line_item" alter column "is_tax_inclusive" set default false;'
    )
    this.addSql(
      'alter table if exists "cart_line_item" add constraint "cart_line_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_cart_line_item_cart_id" ON "cart_line_item" (cart_id) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "cart_line_item_adjustment" add constraint "cart_line_item_adjustment_item_id_foreign" foreign key ("item_id") references "cart_line_item" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_cart_line_item_adjustment_item_id" ON "cart_line_item_adjustment" (item_id) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "cart_line_item_tax_line" add constraint "cart_line_item_tax_line_item_id_foreign" foreign key ("item_id") references "cart_line_item" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_cart_line_item_tax_line_item_id" ON "cart_line_item_tax_line" (item_id) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "cart_shipping_method" add constraint "cart_shipping_method_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_cart_shipping_method_cart_id" ON "cart_shipping_method" (cart_id) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_cart_shipping_method_adjustment_shipping_method_id" ON "cart_shipping_method_adjustment" (shipping_method_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_cart_shipping_method_tax_line_shipping_method_id" ON "cart_shipping_method_tax_line" (shipping_method_id) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "cart_line_item" drop constraint if exists "cart_line_item_cart_id_foreign";'
    )

    this.addSql(
      'alter table if exists "cart_line_item_adjustment" drop constraint if exists "cart_line_item_adjustment_item_id_foreign";'
    )

    this.addSql(
      'alter table if exists "cart_line_item_tax_line" drop constraint if exists "cart_line_item_tax_line_item_id_foreign";'
    )

    this.addSql(
      'alter table if exists "cart_shipping_method" drop constraint if exists "cart_shipping_method_cart_id_foreign";'
    )

    this.addSql(
      'alter table if exists "cart_line_item" alter column "is_tax_inclusive" drop default;'
    )
    this.addSql(
      'alter table if exists "cart_line_item" alter column "is_tax_inclusive" type boolean using ("is_tax_inclusive"::boolean);'
    )
    this.addSql('drop index if exists "IDX_cart_line_item_cart_id";')
    this.addSql(
      'alter table if exists "cart_line_item" add constraint "cart_line_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;'
    )

    this.addSql('drop index if exists "IDX_cart_line_item_adjustment_item_id";')
    this.addSql(
      'alter table if exists "cart_line_item_adjustment" add constraint "cart_line_item_adjustment_item_id_foreign" foreign key ("item_id") references "cart_line_item" ("id") on update cascade;'
    )

    this.addSql('drop index if exists "IDX_cart_line_item_tax_line_item_id";')
    this.addSql(
      'alter table if exists "cart_line_item_tax_line" add constraint "cart_line_item_tax_line_item_id_foreign" foreign key ("item_id") references "cart_line_item" ("id") on update cascade;'
    )

    this.addSql('drop index if exists "IDX_cart_shipping_method_cart_id";')
    this.addSql(
      'alter table if exists "cart_shipping_method" add constraint "cart_shipping_method_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;'
    )

    this.addSql(
      'drop index if exists "IDX_cart_shipping_method_adjustment_shipping_method_id";'
    )

    this.addSql(
      'drop index if exists "IDX_cart_shipping_method_tax_line_shipping_method_id";'
    )
  }
}
