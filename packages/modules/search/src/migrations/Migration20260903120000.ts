import { Migration } from "@medusajs/framework/mikro-orm/migrations";

// Not a data model, so `migration:create` can't generate this: a single,
// global monotonic counter every write (live or from a `seed()` pass) draws
// from, so a live write racing a bulk seed for the same document can always
// tell which of the two actually happened later.
export class Migration20260903120000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create sequence if not exists "search_index_write_seq";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop sequence if exists "search_index_write_seq";`);
  }

}
