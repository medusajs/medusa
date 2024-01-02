import { Migration } from "@mikro-orm/migrations"

export class Migration20231221104256 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "promotion" ("id" text not null, "code" text not null, "is_automatic" boolean not null default false, "type" text check ("type" in (\'standard\', \'buyget\')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "promotion_pkey" primary key ("id"));'
    )
    this.addSql('create index "IDX_promotion_code" on "promotion" ("code");')
    this.addSql('create index "IDX_promotion_type" on "promotion" ("type");')
    this.addSql(
      'alter table "promotion" add constraint "IDX_promotion_code_unique" unique ("code");'
    )

    this.addSql(
      'create table "application_method" ("id" text not null, "value" numeric null, "max_quantity" numeric null, "type" text check ("type" in (\'fixed\', \'percentage\')) not null, "target_type" text check ("target_type" in (\'order\', \'shipping\', \'item\')) not null, "allocation" text check ("allocation" in (\'each\', \'across\')) null, "promotion_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "application_method_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_application_method_type" on "application_method" ("type");'
    )
    this.addSql(
      'create index "IDX_application_method_target_type" on "application_method" ("target_type");'
    )
    this.addSql(
      'create index "IDX_application_method_allocation" on "application_method" ("allocation");'
    )
    this.addSql(
      'alter table "application_method" add constraint "application_method_promotion_id_unique" unique ("promotion_id");'
    )

    this.addSql(
      'alter table "application_method" add constraint "application_method_promotion_id_foreign" foreign key ("promotion_id") references "promotion" ("id") on update cascade;'
    )
  }
}
