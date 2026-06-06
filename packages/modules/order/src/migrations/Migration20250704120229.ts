import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250704120229 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "order_credit_line" drop constraint if exists "order_credit_line_order_id_foreign";`
    )

    this.addSql(
      `alter table if exists "order_credit_line" add constraint "order_credit_line_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "order_credit_line" drop constraint if exists "order_credit_line_order_id_foreign";`
    )

    this.addSql(
      `alter table if exists "order_credit_line" add constraint "order_credit_line_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`
    )
  }
}
