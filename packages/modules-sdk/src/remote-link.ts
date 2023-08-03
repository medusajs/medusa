import {
  ILinkModule,
  LoadedModule,
  ModuleJoinerConfig,
  ModuleJoinerRelationship,
} from "@medusajs/types"

import { MedusaModule } from "./medusa-module"

export type DeleteEntityInput = {
  [moduleName: string]: { [linkableKey: string]: string[] }
}

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
type DeleteEntities = { [key: string]: string[] }
type RemovedIds = {
  [serviceName: string]: DeleteEntities
}

type LinkRemoveErrors = {
  serviceName: string
  args: any
  error: Error
}

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
          if (joinerConfig.isLink && !relationship.deleteCascade) {
            continue
          }

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

  async remove(
    removedServices: DeleteEntityInput
  ): Promise<[LinkRemoveErrors[] | null, RemovedIds[]]> {
    const removedIds: RemovedIds = {}
    const processedIds: Record<string, Set<string>> = {}

    const services = Object.keys(removedServices).map((serviceName) => {
      const deleteKeys = {}

      for (const field in removedServices[serviceName]) {
        deleteKeys[field] = Array.isArray(removedServices[serviceName][field])
          ? removedServices[serviceName][field]
          : [removedServices[serviceName][field]]
      }

      return { serviceName, deleteKeys }
    })

    const errors: LinkRemoveErrors[] = []
    const cascadeDelete = async (
      services: { serviceName: string; deleteKeys: DeleteEntities }[],
      isCascading: boolean = false
    ): Promise<RemovedIds[]> => {
      if (errors.length) {
        return []
      }

      const removedIdsList: RemovedIds[] = []

      const servicePromises = services.map(async (serviceInfo) => {
        const serviceRelations = this.relations.get(serviceInfo.serviceName)!
        const values = serviceInfo.deleteKeys

        const deletePromises: Promise<void>[] = []

        for (const field in values) {
          const relatedServices = serviceRelations.get(field)

          if (!relatedServices || !values[field]?.length) {
            continue
          }

          const relatedServicesPromises = relatedServices.map(
            async (relatedService) => {
              const { serviceName, primaryKey } = relatedService
              const processedHash = `${serviceName}-${primaryKey}`

              if (!processedIds[processedHash]) {
                processedIds[processedHash] = new Set()
              }

              const unprocessedIds = values[field].filter(
                (id) => !processedIds[processedHash].has(id)
              )

              if (!unprocessedIds.length) {
                return
              }

              let cascadeDelKeys: DeleteEntities = {}
              cascadeDelKeys[primaryKey] = unprocessedIds
              const service: ILinkModule = this.modulesMap.get(serviceName)!

              const returnFields = this.getLinkableKeys(
                service as LoadedLinkModule
              )

              errors

              let deletedEntities: Record<string, string[]>

              try {
                deletedEntities = (await service.softDelete(cascadeDelKeys, {
                  returnLinkableKeys: returnFields,
                })) as Record<string, string[]>
              } catch (e) {
                errors.push({
                  serviceName,
                  args: cascadeDelKeys,
                  error: e,
                })
                return
              }

              if (Object.keys(deletedEntities).length === 0) {
                return
              }

              if (!isCascading) {
                removedIds[serviceName] = {
                  ...deletedEntities,
                }
              } else {
                const [mainKey] = returnFields

                if (!removedIds[serviceName]) {
                  removedIds[serviceName] = {}
                }
                if (!removedIds[serviceName][mainKey]) {
                  removedIds[serviceName][mainKey] = []
                }

                removedIds[serviceName][mainKey] = removedIds[serviceName][
                  mainKey
                ].concat(deletedEntities[mainKey])
              }

              Object.keys(deletedEntities).forEach((key) => {
                deletedEntities[key].forEach((id) => {
                  const hash = `${serviceName}-${key}`
                  if (!processedIds[hash]) {
                    processedIds[hash] = new Set()
                  }

                  processedIds[hash].add(id)
                })
              })

              await cascadeDelete(
                [
                  {
                    serviceName: serviceName,
                    deleteKeys: deletedEntities as DeleteEntities,
                  },
                ],
                true
              )
            }
          )

          deletePromises.push(...relatedServicesPromises)
        }

        await Promise.all(deletePromises)
        removedIdsList.push(removedIds)
      })

      await Promise.all(servicePromises)
      return removedIdsList
    }

    const result = await cascadeDelete(services)

    return [errors.length ? errors : null, result]
  }

  // TODO: restore, delete,
}
