import { Migration } from "@mikro-orm/migrations"

export class Migration20240708193823 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "return" add constraint "return_exchange_id_unique" unique ("exchange_id");'
    )
    this.addSql(
      'alter table if exists "return" add constraint "return_claim_id_unique" unique ("claim_id");'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_return_deleted_at" ON "return" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )

    this.addSql(
      'alter table if exists "order_exchange" add constraint "order_exchange_return_id_unique" unique ("return_id");'
    )

    this.addSql(
      'alter table if exists "order_claim" add constraint "order_claim_return_id_unique" unique ("return_id");'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_return_reason_parent_return_reason_id" ON "return_reason" (parent_return_reason_id) WHERE deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_return_reason_deleted_at" ON "return_reason" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )

    this.addSql(
      'alter table if exists "return" add constraint "return_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;'
    )

    this.addSql(
      'alter table if exists "order_exchange" add constraint "order_exchange_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;'
    )

    this.addSql(
      'alter table if exists "order_exchange_item" add constraint "order_exchange_item_item_id_foreign" foreign key ("item_id") references "order_line_item" ("id") on update cascade;'
    )

    this.addSql(
      'alter table if exists "order_claim" add constraint "order_claim_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;'
    )

    this.addSql(
      'alter table if exists "order_claim_item" add constraint "order_claim_item_item_id_foreign" foreign key ("item_id") references "order_line_item" ("id") on update cascade;'
    )

    this.addSql(
      'alter table if exists "return_item" add constraint "return_item_reason_id_foreign" foreign key ("reason_id") references "return_reason" ("id") on update cascade on delete set null;'
    )
    this.addSql(
      'alter table if exists "return_item" add constraint "return_item_return_id_foreign" foreign key ("return_id") references "return" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table if exists "return_item" add constraint "return_item_item_id_foreign" foreign key ("item_id") references "order_line_item" ("id") on update cascade;'
    )

    this.addSql(
      'alter table if exists "order_change" add constraint "order_change_return_id_foreign" foreign key ("return_id") references "return" ("id") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table if exists "order_change_action" add column if not exists "return_id" text null;'
    )
    this.addSql(
      'alter table if exists "order_change_action" add constraint "order_change_action_return_id_foreign" foreign key ("return_id") references "return" ("id") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table if exists "order_shipping" add column if not exists "return_id" text null;'
    )

    this.addSql(
      'alter table if exists "order_transaction" add column if not exists "return_id" text null;'
    )
    this.addSql(
      'alter table if exists "order_item" add column if not exists "exchange_id" text null, add column if not exists "claim_id" text null;'
    )
    this.addSql(
      'alter table if exists "order_transaction" add constraint "order_transaction_return_id_foreign" foreign key ("return_id") references "return" ("id") on update cascade on delete set null;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_order_item_exchange_id" ON "order_item" (exchange_id) WHERE exchange_id IS NOT NULL AND deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_order_item_claim_id" ON "order_item" (claim_id) WHERE claim_id IS NOT NULL AND deleted_at IS NOT NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_order_transaction_deleted_at" ON "order_transaction" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )

    // TODO: This isn't possible at the moment as we use references before the actual record is created. Bring this back if that is possible.
    // this.addSql(
    //   'alter table if exists "return" add constraint "return_exchange_id_foreign" foreign key ("exchange_id") references "order_exchange" ("id") on delete set null;'
    // )
    // this.addSql(
    //   'alter table if exists "return" add constraint "return_claim_id_foreign" foreign key ("claim_id") references "order_claim" ("id") on delete set null;'
    // )

    // this.addSql(
    //   'alter table if exists "order_exchange" add constraint "order_exchange_return_id_foreign" foreign key ("return_id") references "return" ("id") on delete set null;'
    // )

    // this.addSql(
    //   'alter table if exists "order_exchange_item" add constraint "order_exchange_item_exchange_id_foreign" foreign key ("exchange_id") references "order_exchange" ("id") on update cascade on delete cascade;'
    // )

    // this.addSql(
    //   'alter table if exists "order_claim" add constraint "order_claim_return_id_foreign" foreign key ("return_id") references "return" ("id") on delete set null;'
    // )

    // this.addSql(
    //   'alter table if exists "order_claim_item" add constraint "order_claim_item_claim_id_foreign" foreign key ("claim_id") references "order_claim" ("id") on update cascade on delete cascade;'
    // )

    // this.addSql(
    //   'alter table if exists "order_claim_item_image" add constraint "order_claim_item_image_claim_item_id_foreign" foreign key ("claim_item_id") references "order_claim_item" ("id") on update cascade;'
    // )

    // this.addSql(
    //   'alter table if exists "order_change" add constraint "order_change_claim_id_foreign" foreign key ("claim_id") references "order_claim" ("id") on update cascade on delete set null;'
    // )
    // this.addSql(
    //   'alter table if exists "order_change" add constraint "order_change_exchange_id_foreign" foreign key ("exchange_id") references "order_exchange" ("id") on update cascade on delete set null;'
    // )

    // this.addSql(
    //   'alter table if exists "order_change_action" add constraint "order_change_action_claim_id_foreign" foreign key ("claim_id") references "order_claim" ("id") on update cascade on delete set null;'
    // )
    // this.addSql(
    //   'alter table if exists "order_change_action" add constraint "order_change_action_exchange_id_foreign" foreign key ("exchange_id") references "order_exchange" ("id") on update cascade on delete set null;'
    // )
    // this.addSql(
    //   'alter table if exists "order_shipping" add constraint "order_shipping_return_id_foreign" foreign key ("return_id") references "return" ("id") on update cascade on delete set null;'
    // )
    // this.addSql(
    //   'alter table if exists "order_shipping" add constraint "order_shipping_exchange_id_foreign" foreign key ("exchange_id") references "order_exchange" ("id") on update cascade on delete set null;'
    // )
    // this.addSql(
    //   'alter table if exists "order_shipping" add constraint "order_shipping_claim_id_foreign" foreign key ("claim_id") references "order_claim" ("id") on update cascade on delete set null;'
    // )
    // this.addSql(
    //   'alter table if exists "order_transaction" add constraint "order_transaction_exchange_id_foreign" foreign key ("exchange_id") references "order_exchange" ("id") on update cascade on delete set null;'
    // )
    // this.addSql(
    //   'alter table if exists "order_transaction" add constraint "order_transaction_claim_id_foreign" foreign key ("claim_id") references "order_claim" ("id") on update cascade on delete set null;'
    // )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "order_change" drop constraint if exists "order_change_return_id_foreign";'
    )

    this.addSql(
      'alter table if exists "order_change_action" drop constraint if exists "order_change_action_return_id_foreign";'
    )

    this.addSql(
      'alter table if exists "return_item" drop constraint if exists "return_item_return_id_foreign";'
    )

    this.addSql(
      'alter table if exists "order_transaction" drop constraint if exists "order_transaction_return_id_foreign";'
    )

    this.addSql(
      'alter table if exists "order_shipping" drop constraint if exists "order_shipping_claim_id_foreign";'
    )

    this.addSql(
      'alter table if exists "return_item" drop constraint if exists "return_item_reason_id_foreign";'
    )

    this.addSql('drop table if exists "return_item" cascade;')

    this.addSql('drop index if exists "IDX_order_change_return_id";')
    this.addSql('drop index if exists "IDX_order_change_claim_id";')
    this.addSql('drop index if exists "IDX_order_change_exchange_id";')

    this.addSql('drop index if exists "IDX_order_change_action_return_id";')
    this.addSql('drop index if exists "IDX_order_change_action_claim_id";')
    this.addSql('drop index if exists "IDX_order_change_action_exchange_id";')
    this.addSql(
      'alter table if exists "order_change_action" drop column if exists "return_id";'
    )

    this.addSql(
      'alter table if exists "order_shipping" drop column if exists "return_id";'
    )

    this.addSql('drop index if exists "IDX_order_item_exchange_id";')
    this.addSql('drop index if exists "IDX_order_item_claim_id";')
    this.addSql('drop index if exists "IDX_order_transaction_deleted_at";')
    this.addSql(
      'alter table if exists "order_transaction" drop column if exists "return_id";'
    )
    this.addSql(
      'alter table if exists "order_item" drop column if exists "exchange_id", drop column if exists "claim_id";'
    )

    // TODO: This isn't possible at the moment as we use references before the actual record is created. Bring this back if that is possible.
    // this.addSql(
    //   'alter table if exists "order_exchange" drop constraint if exists "order_exchange_return_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_claim" drop constraint if exists "order_claim_return_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_shipping" drop constraint if exists "order_shipping_return_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "return" drop constraint if exists "return_exchange_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_exchange_item" drop constraint if exists "order_exchange_item_exchange_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_change" drop constraint if exists "order_change_exchange_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_change_action" drop constraint if exists "order_change_action_exchange_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_shipping" drop constraint if exists "order_shipping_exchange_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_transaction" drop constraint if exists "order_transaction_exchange_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "return" drop constraint if exists "return_claim_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_claim_item" drop constraint if exists "order_claim_item_claim_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_change" drop constraint if exists "order_change_claim_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_change_action" drop constraint if exists "order_change_action_claim_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_transaction" drop constraint if exists "order_transaction_claim_id_foreign";'
    // )

    // this.addSql(
    //   'alter table if exists "order_claim_item_image" drop constraint if exists "order_claim_item_image_claim_item_id_foreign";'
    // )
  }
}
