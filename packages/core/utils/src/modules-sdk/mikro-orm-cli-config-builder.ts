import { MikroORMOptions } from "@mikro-orm/core/utils/Configuration"
import { DmlEntity, toMikroOrmEntities } from "../dml"
import { TSMigrationGenerator } from "../dal"
import type {
  AnyEntity,
  EntityClass,
  EntityClassGroup,
} from "@mikro-orm/core/typings"
import type { EntitySchema } from "@mikro-orm/core/metadata/EntitySchema"
import { kebabCase } from "../common"

type Options = Partial<MikroORMOptions> & {
  entities: (
    | string
    | EntityClass<AnyEntity>
    | EntityClassGroup<AnyEntity>
    | EntitySchema
    | DmlEntity<any, any>
  )[]
  databaseName?: string
}

type ReturnedOptions = Partial<MikroORMOptions> & {
  entities: MikroORMOptions["entities"]
  clientUrl: string
  type: MikroORMOptions["type"]
  migrations: MikroORMOptions["migrations"]
}

/**
 * Defines a MikroORM CLI config based on the provided options.
 * Convert any DML entities to MikroORM entities to be consumed
 * by mikro orm cli.
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
    (entity) => !DmlEntity.isDmlEntity(entity)
  )

  const entities = nonDmlEntities.concat(toMikroOrmEntities(dmlEntities))

  const normalizedModuleName = kebabCase(moduleName.replace("Service", ""))
  let databaseName = `medusa-${normalizedModuleName}`

  if (options.databaseName) {
    databaseName = options.databaseName
    // @ts-ignore
    delete options.databaseName
  }

  return {
    clientUrl: `postgres://postgres@localhost/${databaseName}`,
    type: "postgresql",
    ...options,
    entities,
    migrations: {
      generator: TSMigrationGenerator,
      ...options.migrations,
    },
  }
}
