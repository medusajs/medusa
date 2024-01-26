import { Migration } from "@mikro-orm/migrations"

export class Migration20240122084316 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "campaign" ("id" text not null, "name" text not null, "description" text null, "currency" text null, "campaign_identifier" text not null, "starts_at" timestamptz null, "ends_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "campaign_pkey" primary key ("id"));'
    )
    this.addSql(
      'alter table "campaign" add constraint "IDX_campaign_identifier_unique" unique ("campaign_identifier");'
    )

    this.addSql(
      'create table "campaign_budget" ("id" text not null, "type" text check ("type" in (\'spend\', \'usage\')) not null, "campaign_id" text not null, "limit" numeric null default null, "used" numeric not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "campaign_budget_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_campaign_budget_type" on "campaign_budget" ("type");'
    )
    this.addSql(
      'alter table "campaign_budget" add constraint "campaign_budget_campaign_id_unique" unique ("campaign_id");'
    )

    this.addSql(
      'create table "promotion" ("id" text not null, "code" text not null, "campaign_id" text null, "is_automatic" boolean not null default false, "type" text check ("type" in (\'standard\', \'buyget\')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "promotion_pkey" primary key ("id"));'
    )
    this.addSql('create index "IDX_promotion_code" on "promotion" ("code");')
    this.addSql('create index "IDX_promotion_type" on "promotion" ("type");')
    this.addSql(
      'alter table "promotion" add constraint "IDX_promotion_code_unique" unique ("code");'
    )

    this.addSql(
      'create table "application_method" ("id" text not null, "value" numeric null, "max_quantity" numeric null, "apply_to_quantity" numeric null, "buy_rules_min_quantity" numeric null, "type" text check ("type" in (\'fixed\', \'percentage\')) not null, "target_type" text check ("target_type" in (\'order\', \'shipping_methods\', \'items\')) not null, "allocation" text check ("allocation" in (\'each\', \'across\')) null, "promotion_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "application_method_pkey" primary key ("id"));'
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
      'create table "promotion_rule" ("id" text not null, "description" text null, "attribute" text not null, "operator" text check ("operator" in (\'gte\', \'lte\', \'gt\', \'lt\', \'eq\', \'ne\', \'in\')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "promotion_rule_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_promotion_rule_attribute" on "promotion_rule" ("attribute");'
    )
    this.addSql(
      'create index "IDX_promotion_rule_operator" on "promotion_rule" ("operator");'
    )

    this.addSql(
      'create table "promotion_promotion_rule" ("promotion_id" text not null, "promotion_rule_id" text not null, constraint "promotion_promotion_rule_pkey" primary key ("promotion_id", "promotion_rule_id"));'
    )

    this.addSql(
      'create table "application_method_target_rules" ("application_method_id" text not null, "promotion_rule_id" text not null, constraint "application_method_target_rules_pkey" primary key ("application_method_id", "promotion_rule_id"));'
    )

    this.addSql(
      'create table "application_method_buy_rules" ("application_method_id" text not null, "promotion_rule_id" text not null, constraint "application_method_buy_rules_pkey" primary key ("application_method_id", "promotion_rule_id"));'
    )

    this.addSql(
      'create table "promotion_rule_value" ("id" text not null, "promotion_rule_id" text not null, "value" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "promotion_rule_value_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_promotion_rule_promotion_rule_value_id" on "promotion_rule_value" ("promotion_rule_id");'
    )

    this.addSql(
      'alter table "campaign_budget" add constraint "campaign_budget_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "promotion" add constraint "promotion_campaign_id_foreign" foreign key ("campaign_id") references "campaign" ("id") on delete set null;'
    )

    this.addSql(
      'alter table "application_method" add constraint "application_method_promotion_id_foreign" foreign key ("promotion_id") references "promotion" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "promotion_promotion_rule" add constraint "promotion_promotion_rule_promotion_id_foreign" foreign key ("promotion_id") references "promotion" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "promotion_promotion_rule" add constraint "promotion_promotion_rule_promotion_rule_id_foreign" foreign key ("promotion_rule_id") references "promotion_rule" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "application_method_target_rules" add constraint "application_method_target_rules_application_method_id_foreign" foreign key ("application_method_id") references "application_method" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "application_method_target_rules" add constraint "application_method_target_rules_promotion_rule_id_foreign" foreign key ("promotion_rule_id") references "promotion_rule" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "application_method_buy_rules" add constraint "application_method_buy_rules_application_method_id_foreign" foreign key ("application_method_id") references "application_method" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "application_method_buy_rules" add constraint "application_method_buy_rules_promotion_rule_id_foreign" foreign key ("promotion_rule_id") references "promotion_rule" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "promotion_rule_value" add constraint "promotion_rule_value_promotion_rule_id_foreign" foreign key ("promotion_rule_id") references "promotion_rule" ("id") on update cascade on delete cascade;'
    )
  }
}
