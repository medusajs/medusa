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
  private relationsPairs: Map<string, LoadedModule> = new Map()
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
        if (joinerConfig.isLink) {
          const [primary, foreign] = joinerConfig.relationships
          const key = [
            primary.serviceName,
            primary.foreignKey,
            foreign.serviceName,
            foreign.foreignKey,
          ].join("-")
          this.relationsPairs.set(key, mod)
        }

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

  getLinkModule(
    moduleA: string,
    moduleAKey: string,
    moduleB: string,
    moduleBKey: string
  ) {
    const key = [moduleA, moduleAKey, moduleB, moduleBKey].join("-")
    return this.relationsPairs.get(key)
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
        const { serviceName, deleteCascade } = relationship

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

  async create(link: LinkDefinition | LinkDefinition[]) {
    const allLinks = Array.isArray(link) ? link : [link]

    const promises: Promise<void>[] = []
    for (const rel of allLinks) {
      const mods = Object.keys(rel)
      if (mods.length > 2) {
        throw new Error(`Only 2 modules can be linked.`)
      }

      const [moduleA, moduleB] = mods
      const moduleAKey = Object.keys(rel[moduleA]).join(",")
      const moduleBKey = Object.keys(rel[moduleB]).join(",")

      const service = this.getLinkModule(
        moduleA,
        moduleAKey,
        moduleB,
        moduleBKey
      )

      if (!service) {
        throw new Error(
          `Link module to connect ${moduleA}[${moduleAKey}] and ${moduleB}[${moduleBKey}] was not found.`
        )
      }

      promises.push(service.create(keys))
    }
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
