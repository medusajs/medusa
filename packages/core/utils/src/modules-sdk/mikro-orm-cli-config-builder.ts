import type {
  AnyEntity,
  EntityClass,
  EntityClassGroup,
  EntitySchema,
  MikroORMOptions,
} from "@zjedene-medusa/deps/mikro-orm/core"
import { defineConfig } from "@zjedene-medusa/deps/mikro-orm/postgresql"
import { kebabCase } from "../common"
import { CustomDBMigrator, CustomTsMigrationGenerator } from "../dal"
import { DmlEntity, toMikroOrmEntities } from "../dml"

type Options = Partial<Omit<MikroORMOptions, "entities" | "entitiesTs">> & {
  entities: (
    | string
    | EntityClass<AnyEntity>
    | EntityClassGroup<AnyEntity>
    | EntitySchema
    | DmlEntity<any, any>
  )[]
}

type ReturnedOptions = Partial<MikroORMOptions> & {
  entities: MikroORMOptions["entities"]
  migrations: MikroORMOptions["migrations"]
}

/**
 * Defines a MikroORM CLI config based on the provided options.
 * Convert any DML entities to MikroORM entities to be consumed
 * by mikro orm cli.
 *
 * @param moduleName
 * @param options
 */
export function defineMikroOrmCliConfig(
  moduleName: string,
  options: Options
): ReturnedOptions {
  if (!options.entities?.length) {
    throw new Error("defineMikroOrmCliConfig failed with: entities is required")
  }

  const dmlEntities = options.entities.filter(DmlEntity.isDmlEntity)
  const nonDmlEntities = options.entities.filter(
    (entity) => entity && !DmlEntity.isDmlEntity(entity)
  )

  const entities = nonDmlEntities.concat(
    toMikroOrmEntities(dmlEntities)
  ) as MikroORMOptions["entities"]

  const normalizedModuleName = kebabCase(moduleName.replace("Service", ""))
  const databaseName = `medusa-${normalizedModuleName}`

  return defineConfig({
    dbName: databaseName,
    host: "127.0.0.1",
    user: "postgres",
    password: "",
    ...(options as any),
    entities: entities.filter(Boolean),
    migrations: {
      snapshotName: `.snapshot-${databaseName}`,
      generator: CustomTsMigrationGenerator,
      ...options.migrations,
    },
    extensions: [CustomDBMigrator],
  }) as ReturnedOptions
}
