import { Migration } from "@mikro-orm/migrations"

export class Migration20251022153442 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "product_product_option" (
        "id" text not null,
        "product_id" text not null,
        "product_option_id" text not null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        "deleted_at" timestamptz null,
        constraint "product_product_option_pkey" primary key ("id")
      );
    `)

    this.addSql(`
      alter table if exists "product_product_option"
        add constraint "product_product_option_product_id_foreign"
        foreign key ("product_id") references "product" ("id")
        on update cascade on delete cascade;
    `)

    this.addSql(`
      alter table if exists "product_product_option"
        add constraint "product_product_option_product_option_id_foreign"
        foreign key ("product_option_id") references "product_option" ("id")
        on update cascade on delete cascade;
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_product_product_option_product_id"
      ON "product_product_option" (product_id) WHERE deleted_at IS NULL;
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_product_product_option_product_option_id"
      ON "product_product_option" (product_option_id) WHERE deleted_at IS NULL;
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_product_product_option_deleted_at"
      ON "product_product_option" (deleted_at) WHERE deleted_at IS NULL;
    `)

    this.addSql(`
      alter table if exists "product_option"
      add column if not exists "is_exclusive" boolean not null default false;
    `)

    this.addSql(`
      insert into "product_product_option" ("id", "product_id", "product_option_id")
      select gen_random_uuid(), "product_id", "id"
      from "product_option"
      where "product_id" is not null;
    `)

    this.addSql(`
      update "product_option" set "is_exclusive" = true
      where "product_id" is not null;
    `)

    this.addSql(
      `alter table if exists "product_option" drop constraint if exists "product_option_product_id_foreign";`
    )
    this.addSql(`drop index if exists "IDX_product_option_product_id";`)
    this.addSql(`drop index if exists "IDX_option_product_id_title_unique";`)
    this.addSql(
      `alter table if exists "product_option" drop column if exists "product_id";`
    )
  }

  override async down(): Promise<void> {
    // Recreate product_id column before removing the pivot
    this.addSql(`
      alter table if exists "product_option"
      add column if not exists "product_id" text;
    `)

    // Migrate data back from join table
    this.addSql(`
      update "product_option" po
      set "product_id" = ppo."product_id"
      from "product_product_option" ppo
      where po."id" = ppo."product_option_id"
        and ppo."deleted_at" is null;
    `)

    // Make product_id NOT NULL
    this.addSql(`
      alter table if exists "product_option"
      alter column "product_id" set not null;
    `)

    // Re-add foreign key and indexes
    this.addSql(`
      alter table if exists "product_option"
      add constraint "product_option_product_id_foreign"
      foreign key ("product_id") references "product" ("id")
      on update cascade on delete cascade;
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "IDX_product_option_product_id"
      ON "product_option" (product_id) WHERE deleted_at IS NULL;
    `)

    this.addSql(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_product_id_title_unique"
      ON "product_option" (product_id, title) WHERE deleted_at IS NULL;
    `)

    // Drop the join table
    this.addSql(`drop table if exists "product_product_option" cascade;`)

    // Drop is_exclusive column
    this.addSql(`
      alter table if exists "product_option" drop column if exists "is_exclusive";
    `)
  }
}
