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




    ALTER TABLE "order_transaction"
    ADD COLUMN if NOT exists "return_id" TEXT NULL;

    ALTER TABLE "order_transaction"
    ADD COLUMN if NOT exists "claim_id" TEXT NULL;

    ALTER TABLE "order_transaction"
    ADD COLUMN if NOT exists "exchange_id" TEXT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_transaction_return_id" ON "order_transaction" (
        return_id
    )
    WHERE return_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_transaction_claim_id" ON "order_transaction" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_transaction_exchange_id" ON "order_transaction" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NULL;



    ALTER TABLE "order_shipping"
    ADD COLUMN if NOT exists "return_id" TEXT NULL;

    ALTER TABLE "order_shipping"
    ADD COLUMN if NOT exists "claim_id" TEXT NULL;

    ALTER TABLE "order_shipping"
    ADD COLUMN if NOT exists "exchange_id" TEXT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_shipping_return_id" ON "order_shipping" (
        return_id
    )
    WHERE return_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_shipping_claim_id" ON "order_shipping" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_shipping_exchange_id" ON "order_shipping" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NULL;




    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "return_id" TEXT NULL;

    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "claim_id" TEXT NULL;

    ALTER TABLE "order_change"
    ADD COLUMN if NOT exists "exchange_id" TEXT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_return_id" ON "order_change" (
        return_id
    )
    WHERE return_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_claim_id" ON "order_change" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_exchange_id" ON "order_change" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NULL;



    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "deleted_at" timestamptz NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_deleted_at" ON "order_change_action" (
        deleted_at
    );

    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "return_id" TEXT NULL;

    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "claim_id" TEXT NULL;

    ALTER TABLE "order_change_action"
    ADD COLUMN if NOT exists "exchange_id" TEXT NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_return_id" ON "order_change_action" (
        return_id
    )
    WHERE return_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_claim_id" ON "order_change_action" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_change_action_exchange_id" ON "order_change_action" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NULL;
    
    

    CREATE TYPE return_status_enum AS ENUM (
        'requested',
        'received',
        'partially_received',
        'canceled'
    );

    CREATE TABLE IF NOT EXISTS "return" (
        "id" TEXT NOT NULL,
        "order_id" TEXT NOT NULL,
        "claim_id" TEXT NULL,
        "exchange_id" TEXT NULL,
        "order_version" INTEGER NOT NULL,
        "display_id" SERIAL,
        "status" return_status_enum NOT NULL DEFAULT 'requested',
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

    CREATE INDEX IF NOT EXISTS "IDX_return_order_id" ON "return" (
        order_id
    )
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_return_claim_id" ON "return" (
        claim_id
    )
    WHERE claim_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_return_exchange_id" ON "return" (
        exchange_id
    )
    WHERE exchange_id IS NOT NULL AND deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_return_display_id" ON "return" (
        display_id
    ) 
    WHERE deleted_at IS NULL;


    CREATE TABLE IF NOT EXISTS "return_item" (
        "id" TEXT NOT NULL,
        "return_id" TEXT NOT NULL,
        "reason_id" TEXT NULL,
        "item_id" TEXT NOT NULL,
        "quantity" NUMERIC NOT NULL,
        "raw_quantity" JSONB NOT NULL,
        "received_quantity" NUMERIC NOT NULL DEFAULT 0,
        "raw_received_quantity" JSONB NOT NULL,
        "note" TEXT NULL,
        "metadata" JSONB NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "return_item_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "IDX_return_item_deleted_at" ON "return_item" ("deleted_at")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_return_item_return_id" ON "return_item" ("return_id")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_return_item_item_id" ON "return_item" ("item_id")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_return_item_reason_id" ON "return_item" ("reason_id")
    WHERE deleted_at IS NULL;



    CREATE TABLE IF NOT EXISTS "order_exchange" (
        "id" TEXT NOT NULL,
        "order_id" TEXT NOT NULL,
        "return_id" TEXT NULL,
        "order_version" INTEGER NOT NULL,
        "display_id" SERIAL,
        "no_notification" BOOLEAN NULL,
        "allow_backorder" BOOLEAN NOT NULL DEFAULT FALSE,
        "difference_due" NUMERIC NULL,
        "raw_difference_due" JSONB NULL,
        "metadata" JSONB NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "canceled_at" timestamptz NULL,
        CONSTRAINT "order_exchange_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "IDX_order_exchange_display_id" ON "order_exchange" ("display_id")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_exchange_deleted_at" ON "order_exchange" ("deleted_at")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_exchange_order_id" ON "order_exchange" ("order_id")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_exchange_return_id" ON "order_exchange" ("return_id")
    WHERE return_id IS NOT NULL AND deleted_at IS NULL;


    CREATE TABLE IF NOT EXISTS "order_exchange_item" (
        "id" TEXT NOT NULL,
        "exchange_id" TEXT NOT NULL,
        "item_id" TEXT NOT NULL,
        "quantity" NUMERIC NOT NULL,
        "raw_quantity" JSONB NOT NULL,
        "note" TEXT NULL,
        "metadata" JSONB NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "order_exchange_item_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "IDX_order_exchange_item_deleted_at" ON "order_exchange_item" ("deleted_at")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_exchange_item_exchange_id" ON "order_exchange_item" ("exchange_id")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_exchange_item_item_id" ON "order_exchange_item" ("item_id")
    WHERE deleted_at IS NULL;



    CREATE TYPE order_claim_type_enum AS ENUM (
        'refund',
        'replace'
    );

    CREATE TABLE IF NOT EXISTS "order_claim" (
        "id" TEXT NOT NULL,
        "order_id" TEXT NOT NULL,
        "return_id" TEXT NULL,
        "order_version" INTEGER NOT NULL,
        "display_id" SERIAL,
        "type" order_claim_type_enum NOT NULL,
        "no_notification" BOOLEAN NULL,
        "refund_amount" NUMERIC NULL,
        "raw_refund_amount" JSONB NULL,
        "metadata" JSONB NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        "canceled_at" timestamptz NULL,
        CONSTRAINT "order_claim_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "IDX_order_claim_display_id" ON "order_claim" ("display_id")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_claim_deleted_at" ON "order_claim" ("deleted_at")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_claim_order_id" ON "order_claim" ("order_id")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_claim_return_id" ON "order_claim" ("return_id")
    WHERE return_id IS NOT NULL AND deleted_at IS NULL;



    CREATE TYPE claim_reason_enum AS ENUM (
        'missing_item',
        'wrong_item',
        'production_failure',
        'other'
    );

    CREATE TABLE IF NOT EXISTS "order_claim_item" (
        "id" TEXT NOT NULL,
        "claim_id" TEXT NOT NULL,
        "item_id" TEXT NOT NULL,
        "is_additional_item" BOOLEAN NOT NULL DEFAULT FALSE,
        "reason" claim_reason_enum NULL,
        "quantity" NUMERIC NOT NULL,
        "raw_quantity" JSONB NOT NULL,
        "note" TEXT NULL,
        "metadata" JSONB NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "order_claim_item_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "IDX_order_claim_item_deleted_at" ON "order_claim_item" ("deleted_at")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_claim_item_claim_id" ON "order_claim_item" ("claim_id")
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS "IDX_order_claim_item_item_id" ON "order_claim_item" ("item_id")
    WHERE deleted_at IS NULL;

    
    
    CREATE TABLE IF NOT EXISTS "order_claim_item_image" (
        "id" TEXT NOT NULL,
        "claim_item_id" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "metadata" JSONB NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz NULL,
        CONSTRAINT "order_claim_item_image_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "IDX_order_claim_item_image_claim_item_id" ON "order_claim_item_image" ("claim_item_id")
    WHERE "deleted_at" IS NOT NULL;
    
    CREATE INDEX IF NOT EXISTS "IDX_order_claim_item_image_deleted_at" ON "order_claim_item_image" ("deleted_at")
    WHERE "deleted_at" IS NOT NULL;
    `
    this.addSql(sql)
  }
}
