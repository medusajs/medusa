import { Migration } from "@mikro-orm/migrations"

export class LockingPostgresSetup extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS locking (
        id CHARACTER VARYING NOT NULL,
        owner_id CHARACTER VARYING NULL,
        expiration TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        PRIMARY KEY (id)
      )
    `)
  }

  async down(): Promise<void> {
    this.addSql(`
      DROP TABLE locking;
    `)
  }
}
