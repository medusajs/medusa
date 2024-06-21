import { MikroORMOptions } from "@mikro-orm/core/utils/Configuration"
import { IDmlEntity } from "@medusajs/types"
import { DmlEntity, toMikroORMEntity } from "../dml"
import { TSMigrationGenerator } from "../dal"

type Options = Partial<MikroORMOptions> & {
  entities: (MikroORMOptions["entities"] | IDmlEntity<any>)[]
  databaseName: string
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
export function defineMikroOrmCliConfig(options: Options): ReturnedOptions {
  if (!options.entities?.length) {
    throw new Error("defineMikroOrmCliConfig failed with: entities is required")
  }

  const entities = options.entities.map((entity) => {
    if (DmlEntity.isDmlEntity(entity)) {
      return toMikroORMEntity(entity)
    }

    return entity
  })

  if (!options.databaseName) {
    throw new Error(
      "defineMikroOrmCliConfig failed with: databaseName is required"
    )
  }

  const databaseName = options.databaseName
  delete options.databaseName

  return {
    entities,
    clientUrl: `postgres://postgres@localhost/${databaseName}`,
    type: "postgresql",
    ...options,
    migrations: {
      generator: TSMigrationGenerator,
      ...options.migrations,
    },
  }
}
