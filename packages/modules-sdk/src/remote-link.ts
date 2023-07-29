import {
  LoadedModule,
  ModuleJoinerConfig,
  ModuleJoinerRelationship,
} from "@medusajs/types"

import { MedusaModule } from "./medusa-module"

type LinkDefinition = {
  [moduleName: string]: {
    [fieldName: string]: string
  }
}

type RemoteRelationship = ModuleJoinerRelationship & {
  isPrimary: boolean
  isForeign: boolean
}

export class RemoteLink {
  private modulesMap: Map<string, LoadedModule> = new Map()
  private relations: Map<string, Map<string, RemoteRelationship[]>> = new Map()

  constructor(modulesLoaded?: LoadedModule[]) {
    if (!modulesLoaded?.length) {
      modulesLoaded = MedusaModule.getLoadedModules().map(
        (mod) => Object.values(mod)[0]
      )
    }

    const servicesConfig: ModuleJoinerConfig[] = []

    for (const mod of modulesLoaded) {
      if (!mod.__definition.isQueryable) {
        continue
      }

      const joinerConfig = mod.__joinerConfig

      const serviceName = joinerConfig.isLink
        ? joinerConfig.serviceName!
        : mod.__definition.key

      if (this.modulesMap.has(serviceName)) {
        throw new Error(
          `Duplicated instance of module ${serviceName} is not allowed.`
        )
      }

      if (joinerConfig.relationships?.length) {
        for (const relationship of joinerConfig.relationships) {
          this.addRelationship(serviceName, {
            ...relationship,
            isPrimary: false,
            isForeign: true,
          })
        }
      }

      if (joinerConfig.extends?.length) {
        for (const service of joinerConfig.extends) {
          const relationship = service.relationship
          this.addRelationship(service.serviceName, {
            ...relationship,
            serviceName: serviceName,
            isPrimary: true,
            isForeign: false,
          })
        }
      }

      this.modulesMap.set(serviceName, mod)
      servicesConfig.push(joinerConfig)
    }
  }

  private addRelationship(
    serviceName: string,
    relationship: RemoteRelationship
  ): void {
    const { primaryKey, foreignKey } = relationship

    if (!this.relations.has(serviceName)) {
      this.relations.set(serviceName, new Map())
    }

    const key = relationship.isPrimary ? primaryKey : foreignKey
    const serviceMap = this.relations.get(serviceName)!
    if (!serviceMap.has(key)) {
      serviceMap.set(key, [])
    }

    serviceMap.get(key)!.push(relationship)
  }

  getRelationships(): Map<string, Map<string, RemoteRelationship[]>> {
    return this.relations
  }

  private getAllRelationships(serviceName: string, keys: string[]) {
    const readServices = new Set<string>()
    const retrieve: {
      serviceName: string
      key: string
      relationship: RemoteRelationship
    }[] = []

    const getRecursive = (
      serviceName: string,
      key: string,
      followCascade: boolean = false
    ) => {
      const hash = serviceName + "-" + key

      if (readServices.has(hash)) {
        return
      }
      readServices.add(hash)

      const serviceMap = this.relations.get(serviceName)
      if (!serviceMap) {
        throw new Error(`Service ${serviceName} does not exist.`)
      }

      const relationships = serviceMap.get(key)
      if (!relationships) {
        return
      }

      for (const relationship of relationships) {
        const { serviceName, deleteCascade, primaryKey, foreignKey } =
          relationship

        if (followCascade && !deleteCascade) {
          continue
        }

        retrieve.push({ serviceName, key, relationship })

        getRecursive(serviceName, key, true)
      }
    }

    for (const key of keys) {
      getRecursive(serviceName, key)
    }

    return retrieve
  }

  async deleteDependencies(
    serviceName: string,
    key: string | string[]
  ): Promise<void> {
    const keys = Array.isArray(key) ? key : [key]
    const toBeDeleted = this.getAllRelationships(serviceName, keys)
    await Promise.all(
      toBeDeleted.map(({ serviceName, key, relationship }) => {
        //service.softDelete(key)
        console.log("soft delete", serviceName, key, relationship)
      })
    )
  }

  // TODO: restore, delete,
}
