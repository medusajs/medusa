import { MigrationInterface, QueryRunner } from "typeorm"

export class distributedLockingPostgresSetup1675857372999
  implements MigrationInterface
{
  name = "distributedLockingPostgresSetup1675857372999"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS distributed_locking (
        id CHARACTER VARYING NOT NULL,
        owner_id CHARACTER VARYING NULL,
        expiration TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (id)
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE distributed_locking;
    `)
  }
}
