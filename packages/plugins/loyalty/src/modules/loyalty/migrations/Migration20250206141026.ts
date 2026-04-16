import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250206141026 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "loyalty_gift_card_invitation" drop constraint if exists "loyalty_gift_card_invitation_gift_card_id_unique";`
    );
    this.addSql(
      `drop index if exists "loyalty_gift_card_invitation_gift_card_id_unique";`
    );
    this.addSql(
      `drop index if exists "IDX_loyalty_gift_card_invitation_gift_card_id";`
    );

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_loyalty_gift_card_invitation_gift_card_id_unique" ON "loyalty_gift_card_invitation" (gift_card_id) WHERE deleted_at IS NULL;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_loyalty_gift_card_invitation_gift_card_id_unique";`
    );

    this.addSql(
      `alter table if exists "loyalty_gift_card_invitation" add constraint "loyalty_gift_card_invitation_gift_card_id_unique" unique ("gift_card_id");`
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_loyalty_gift_card_invitation_gift_card_id" ON "loyalty_gift_card_invitation" (gift_card_id) WHERE deleted_at IS NULL;`
    );
  }
}
