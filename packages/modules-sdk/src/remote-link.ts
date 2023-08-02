import {
  ILinkModule,
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

type LoadedLinkModule = LoadedModule & ILinkModule

export class RemoteLink {
  private modulesMap: Map<string, LoadedLinkModule> = new Map()
  private relationsPairs: Map<string, LoadedLinkModule> = new Map()
  private relations: Map<string, Map<string, RemoteRelationship[]>> = new Map()

  constructor(modulesLoaded?: LoadedModule[]) {
    if (!modulesLoaded?.length) {
      modulesLoaded = MedusaModule.getLoadedModules().map(
        (mod) => Object.values(mod)[0]
      )
    }

    const servicesConfig: ModuleJoinerConfig[] = []

    for (const mod of modulesLoaded) {
      if (!mod.__definition.isQueryable || mod.__joinerConfig.isReadOnlyLink) {
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
          this.relationsPairs.set(key, mod as unknown as LoadedLinkModule)
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

      this.modulesMap.set(serviceName, mod as unknown as LoadedLinkModule)
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

    const getRecursive = (
      serviceName: string,
      keys: string[],
      followCascade: boolean = false
    ) => {
      let retrieve: any = {
        serviceName,
        keys,
        relationships: [],
        next: [],
      }

      keys.forEach((key) => {
        const hash = serviceName + "-" + key
        if (readServices.has(hash)) {
          return
        }
        readServices.add(hash)

        const serviceMap = this.relations.get(serviceName)
        if (!serviceMap) {
          throw new Error(`Service ${serviceName} does not exist.`)
        }

        const relatedServices = serviceMap.get(key)
        if (!relatedServices) {
          return
        }

        const service = this.modulesMap.get(serviceName)!

        relatedServices.forEach((relationship) => {
          const { serviceName } = relationship

          retrieve.relationships.push(relationship)

          if (followCascade) {
            const relationships = service.__joinerConfig.relationships ?? []
            for (const rel of relationships) {
              if (!rel.deleteCascade) {
                continue
              }

              const dep = this.modulesMap.get(rel.serviceName)!

              const linkableKeys = dep.__joinerConfig.linkableKeys ?? []
              const next = getRecursive(rel.serviceName, linkableKeys, true)
              if (next) {
                retrieve.next.push(next)
              }
            }
          } else {
            const next = getRecursive(serviceName, [key], true)
            if (next) {
              retrieve.next.push(next)
            }
          }
        })
      })

      return retrieve
    }

    let result: any = []
    const recursionResult = getRecursive(serviceName, keys)
    if (recursionResult) {
      result.push(recursionResult)
    }

    return result
  }

  private getLinkableKeys(mod: LoadedLinkModule) {
    return mod.__joinerConfig.linkableKeys ?? []
  }

  async create(link: LinkDefinition | LinkDefinition[]): Promise<void> {
    const allLinks = Array.isArray(link) ? link : [link]
    const serviceLinks = new Map<string, [string | string[], string][]>()

    for (const rel of allLinks) {
      const mods = Object.keys(rel)
      if (mods.length > 2) {
        throw new Error(`Only two modules can be linked.`)
      }

      const [moduleA, moduleB] = mods
      const pk = Object.keys(rel[moduleA])
      const moduleAKey = pk.join(",")
      const moduleBKey = Object.keys(rel[moduleB]).join(",")

      const service = this.getLinkModule(
        moduleA,
        moduleAKey,
        moduleB,
        moduleBKey
      )

      if (!service) {
        throw new Error(
          `Module to link ${moduleA}[${moduleAKey}] and ${moduleB}[${moduleBKey}] was not found.`
        )
      } else if (!serviceLinks.has(service.__definition.key)) {
        serviceLinks.set(service.__definition.key, [])
      }

      const pkValue =
        pk.length === 1 ? rel[moduleA][pk[0]] : pk.map((k) => rel[moduleA][k])

      serviceLinks
        .get(service.__definition.key)
        ?.push([pkValue, rel[moduleB][moduleBKey]])
    }

    const promises: Promise<unknown[]>[] = []
    for (const [serviceName, links] of serviceLinks) {
      const service = this.modulesMap.get(serviceName)!
      promises.push(service.create(links))
    }

    await Promise.all(promises)
  }

  async deleteAllDependencies(deps, values) {
    let deletedKeys = {}

    const deletePromises = deps.map(async (dep) => {
      const service: any = this.modulesMap.get(dep.serviceName)!
      const deleteResult = await service.softDelete(dep.key, values[dep.key])
      deletedKeys = { ...deletedKeys, ...deleteResult }

      if (dep.next.length > 0) {
        let nextValues = {}
        for (let rel of dep.relationships) {
          if (deletedKeys[rel.foreignKey]) {
            nextValues[rel.foreignKey] = deletedKeys[rel.foreignKey]
          }
        }
        const nextDeletedKeys = await this.deleteAllDependencies(
          dep.next,
          nextValues
        )
        deletedKeys = { ...deletedKeys, ...nextDeletedKeys }
      }
    })

    await Promise.all(deletePromises)
    return deletedKeys
  }

  async remove(link: LinkDefinition | LinkDefinition[]): Promise<void> {
    link = {
      product: {
        product_id: "prod_123",
        variant_id: "var_123",
      },
    }

    const removedIds: Record<string, Record<string, string[]>> = {}

    const allLinks = Array.isArray(link) ? link : [link]
    for (const rel of allLinks) {
      const serviceName = Object.keys(rel)[0]

      const keys = Object.keys(rel[serviceName])
      const toBeDeleted = this.getAllRelationships(serviceName, keys)

      let isCascading: Record<string, boolean> = {}
      await Promise.all(
        toBeDeleted.map(async ({ relationship }) => {
          const { serviceName, primaryKey, foreignKey } = relationship

          if (!removedIds[serviceName]) {
            removedIds[serviceName] = {}
          }

          const value = rel[serviceName][primaryKey]

          const service: ILinkModule = this.modulesMap.get(serviceName)!
          const removedKeys = (await service.softDelete(value)) as Record<
            string,
            string[]
          >

          if (isCascading[serviceName]) {
            const [mainKey] = this.getLinkableKeys(service as LoadedLinkModule)

            removedIds[serviceName][mainKey] = removedIds[serviceName][
              mainKey
            ].concat(removedKeys[mainKey])
          } else {
            for (const key in removedKeys) {
              if (!removedIds[serviceName][key]) {
                removedIds[serviceName][key] = []
              } else {
                removedIds[serviceName][key] = removedIds[serviceName][
                  key
                ].concat(removedKeys[key])
              }
            }
          }

          if (!isCascading[serviceName]) {
            isCascading[serviceName] = true
          }
        })
      )
    }
  }

  // TODO: restore, delete,
}
