import { Migration } from "@mikro-orm/migrations"

export class Migration20240604100512 extends Migration {
  async up(): Promise<void> {
    const sql = `
    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "change_type" TEXT  NULL;

    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "deleted_at" timestamptz NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_change_type" ON "order_change" (
        change_type
    );

    CREATE INDEX IF NOT EXISTS "IDX_order_change_deleted_at" ON "order_change" (
        deleted_at
    );



    ALTER TABLE "order_item"
    ADD COLUMN if NOT exists "return_id" TEXT NULL;

    ALTER TABLE "order_item"
    ADD COLUMN if NOT exists "swap_id" TEXT NULL;

    ALTER TABLE "order_item"
    ADD COLUMN if NOT exists "claim_id" TEXT NULL;

    ALTER TABLE "order_item"
    ADD COLUMN if NOT exists "exchange_id" TEXT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_item_return_id" ON "order_item" (
        return_id
    )
    WHERE return_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_item_swap_id" ON "order_item" (
        swap_id
    )
    WHERE swap_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_item_claim_id" ON "order_item" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_item_exchange_id" ON "order_item" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NOT NULL;



    ALTER TABLE "order_shipping"
    ADD COLUMN if NOT exists "return_id" TEXT NULL;

    ALTER TABLE "order_shipping"
    ADD COLUMN if NOT exists "swap_id" TEXT NULL;

    ALTER TABLE "order_shipping"
    ADD COLUMN if NOT exists "claim_id" TEXT NULL;

    ALTER TABLE "order_shipping"
    ADD COLUMN if NOT exists "exchange_id" TEXT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_shipping_return_id" ON "order_shipping" (
        return_id
    )
    WHERE return_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_shipping_swap_id" ON "order_shipping" (
        swap_id
    )
    WHERE swap_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_shipping_claim_id" ON "order_shipping" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_shipping_exchange_id" ON "order_shipping" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NOT NULL;




    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "return_id" TEXT NULL;

    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "swap_id" TEXT NULL;

    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "claim_id" TEXT NULL;

    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "exchange_id" TEXT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_return_id" ON "order_change" (
        return_id
    )
    WHERE return_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_swap_id" ON "order_change" (
        swap_id
    )
    WHERE swap_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_claim_id" ON "order_change" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_exchange_id" ON "order_change" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NOT NULL;



    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "deleted_at" timestamptz NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_deleted_at" ON "order_change_action" (
        deleted_at
    );

    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "return_id" TEXT NULL;

    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "swap_id" TEXT NULL;

    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "claim_id" TEXT NULL;

    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "exchange_id" TEXT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_return_id" ON "order_change_action" (
        return_id
    )
    WHERE return_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_swap_id" ON "order_change_action" (
        swap_id
    )
    WHERE swap_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_claim_id" ON "order_change_action" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_exchange_id" ON "order_change_action" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NOT NULL;
    
    

    CREATE TABLE IF NOT EXISTS "return" (
        "id" TEXT NOT NULL,
        "order_id" TEXT NOT NULL,
        "order_version" INTEGER NOT NULL,
        "display_id" SERIAL,
        "status" text NOT NULL,
        "no_notification" boolean NULL,
        "refund_amount" NUMERIC NULL,
        "raw_refund_amount" JSONB NULL,
        "metadata" jsonb NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "received_at" timestamptz NULL,
        "canceled_at" timestamptz NULL,
        CONSTRAINT "return_pkey" PRIMARY KEY ("id")
    );
    
    CREATE TYPE return_status_enum AS ENUM (
        'requested',
        'received',
        'partially_received',
        'canceled'
    );
    ALTER TABLE "return" ALTER COLUMN status DROP DEFAULT;
    ALTER TABLE "return" ALTER COLUMN status TYPE return_status_enum USING (status::text::return_status_enum);
    ALTER TABLE "return" ALTER COLUMN status SET DEFAULT 'requested';

    CREATE INDEX IF NOT EXISTS "IDX_return_order_id" ON "return" (
        order_id
    )
    WHERE deleted_at IS NOT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_return_display_id" ON "return" (
        display_id
    ) 
    WHERE deleted_at IS NOT NULL;
    `
    this.addSql(sql)
  }
}
