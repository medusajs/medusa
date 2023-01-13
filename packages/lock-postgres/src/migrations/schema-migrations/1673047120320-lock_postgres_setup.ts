import { ConfigModule } from "@medusajs/medusa"
import {
  createConnection,
  ConnectionOptions,
  MigrationInterface,
  QueryRunner,
} from "typeorm"

import { CONNECTION_NAME } from "../../config"

export const up = async ({ configModule }: { configModule: ConfigModule }) => {
  const connection = await createConnection({
    name: CONNECTION_NAME,
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    migrations: [lockPostgresSetup1673047120320],
    logging: true,
  } as ConnectionOptions)

  await connection.runMigrations()
  await connection.close()
}

export const down = async ({
  configModule,
}: {
  configModule: ConfigModule
}) => {
  const connection = await createConnection({
    name: CONNECTION_NAME,
    type: configModule.projectConfig.database_type,
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    schema: configModule.projectConfig.database_schema,
    migrations: [lockPostgresSetup1673047120320],
    logging: true,
  } as ConnectionOptions)

  await connection.undoLastMigration({ transaction: "all" })
  await connection.close()
}

export class lockPostgresSetup1673047120320 implements MigrationInterface {
  name = "lockPostgresSetup1673047120320"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS lock_service (
        id CHARACTER VARYING NOT NULL,
        owner_id CHARACTER VARYING NULL,
        expiration TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (id)
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE lock_service;
    `)
  }
}
