import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20261022124403 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rbac_role_assignment_role_id_reference_reference_id_unique" ON "rbac_role_assignment" ("role_id", "reference", "reference_id") WHERE scope IS NULL AND scope_id IS NULL AND deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_rbac_role_assignment_role_id_reference_reference_id_unique";`
    )
  }
}
