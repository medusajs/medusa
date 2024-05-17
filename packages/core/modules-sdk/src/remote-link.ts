import {
  ILinkModule,
  LoadedModule,
  ModuleJoinerRelationship,
} from "@medusajs/types"

import { isObject, promiseAll, toPascalCase } from "@medusajs/utils"
import { Modules } from "./definitions"
import { MedusaModule } from "./medusa-module"
import { linkingErrorMessage } from "./utils/linking-error"

export type DeleteEntityInput = {
  [moduleName: string | Modules]: Record<string, string | string[]>
}
export type RestoreEntityInput = DeleteEntityInput

export type LinkDefinition = {
  [moduleName: string]: {
    [fieldName: string]: string
  }
} & {
  data?: Record<string, unknown>
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
type RestoredIds = RemovedIds

type CascadeError = {
  serviceName: string
  method: String
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

    for (const mod of modulesLoaded) {
      this.addModule(mod)
    }
  }

  public addModule(mod: LoadedModule): void {
    if (!mod.__definition.isQueryable || mod.__joinerConfig.isReadOnlyLink) {
      return
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
    return (
      (mod.__joinerConfig.linkableKeys &&
        Object.keys(mod.__joinerConfig.linkableKeys)) ||
      mod.__joinerConfig.primaryKeys ||
      []
    )
  }

  private async executeCascade(
    removedServices: DeleteEntityInput,
    method: "softDelete" | "restore"
  ): Promise<[CascadeError[] | null, RemovedIds]> {
    const removedIds: RemovedIds = {}
    const returnIdsList: RemovedIds = {}
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

    const errors: CascadeError[] = []
    const cascade = async (
      services: { serviceName: string; deleteKeys: DeleteEntities }[],
      isCascading: boolean = false
    ): Promise<RemovedIds> => {
      if (errors.length) {
        return returnIdsList
      }

      const servicePromises = services.map(async (serviceInfo) => {
        const serviceRelations = this.relations.get(serviceInfo.serviceName)!

        if (!serviceRelations) {
          return
        }

        const values = serviceInfo.deleteKeys

        const deletePromises: Promise<void>[] = []

        for (const field in values) {
          const relatedServices = serviceRelations.get(field)

          if (!relatedServices || !values[field]?.length) {
            continue
          }

          const relatedServicesPromises = relatedServices.map(
            async (relatedService) => {
              const { serviceName, primaryKey, args } = relatedService
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

              unprocessedIds.forEach((id) => {
                processedIds[processedHash].add(id)
              })

              let cascadeDelKeys: DeleteEntities = {}
              cascadeDelKeys[primaryKey] = unprocessedIds
              const service: ILinkModule = this.modulesMap.get(serviceName)!

              const returnFields = this.getLinkableKeys(
                service as LoadedLinkModule
              )

              let deletedEntities: Record<string, string[]> = {}

              try {
                if (args?.methodSuffix) {
                  method += toPascalCase(args.methodSuffix)
                }

                const removed = await service[method](cascadeDelKeys, {
                  returnLinkableKeys: returnFields,
                })

                deletedEntities = removed as Record<string, string[]>
              } catch (error) {
                errors.push({
                  serviceName,
                  method,
                  args: cascadeDelKeys,
                  error: JSON.parse(
                    JSON.stringify(error, Object.getOwnPropertyNames(error))
                  ),
                })
                return
              }

              if (Object.keys(deletedEntities).length === 0) {
                return
              }

              removedIds[serviceName] = {
                ...deletedEntities,
              }

              if (!isCascading) {
                returnIdsList[serviceName] = {
                  ...deletedEntities,
                }
              } else {
                const [mainKey] = returnFields

                if (!returnIdsList[serviceName]) {
                  returnIdsList[serviceName] = {}
                }
                if (!returnIdsList[serviceName][mainKey]) {
                  returnIdsList[serviceName][mainKey] = []
                }

                returnIdsList[serviceName][mainKey] = [
                  ...new Set(
                    returnIdsList[serviceName][mainKey].concat(
                      deletedEntities[mainKey]
                    )
                  ),
                ]
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

              await cascade(
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

        await promiseAll(deletePromises)
      })

      await promiseAll(servicePromises)
      return returnIdsList
    }

    const result = await cascade(services)

    return [errors.length ? errors : null, result]
  }

  async create(link: LinkDefinition | LinkDefinition[]): Promise<unknown[]> {
    const allLinks = Array.isArray(link) ? link : [link]
    const serviceLinks = new Map<
      string,
      [string | string[], string, Record<string, unknown>?][]
    >()

    for (const rel of allLinks) {
      const extraFields = rel.data
      delete rel.data

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
          linkingErrorMessage({
            moduleA,
            moduleAKey,
            moduleB,
            moduleBKey,
            type: "link",
          })
        )
      } else if (!serviceLinks.has(service.__definition.key)) {
        serviceLinks.set(service.__definition.key, [])
      }

      const pkValue =
        pk.length === 1 ? rel[moduleA][pk[0]] : pk.map((k) => rel[moduleA][k])

      const fields: unknown[] = [pkValue, rel[moduleB][moduleBKey]]
      if (isObject(extraFields)) {
        fields.push(extraFields)
      }

      serviceLinks.get(service.__definition.key)?.push(fields as any)
    }

    const promises: Promise<unknown[]>[] = []
    for (const [serviceName, links] of serviceLinks) {
      const service = this.modulesMap.get(serviceName)!
      promises.push(service.create(links))
    }

    const created = await promiseAll(promises)
    return created.flat()
  }

  async dismiss(link: LinkDefinition | LinkDefinition[]): Promise<unknown[]> {
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
          linkingErrorMessage({
            moduleA,
            moduleAKey,
            moduleB,
            moduleBKey,
            type: "dismiss",
          })
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
      promises.push(service.dismiss(links))
    }

    const created = await promiseAll(promises)
    return created.flat()
  }

  async delete(
    removedServices: DeleteEntityInput
  ): Promise<[CascadeError[] | null, RemovedIds]> {
    return await this.executeCascade(removedServices, "softDelete")
  }

  async restore(
    removedServices: DeleteEntityInput
  ): Promise<[CascadeError[] | null, RestoredIds]> {
    return await this.executeCascade(removedServices, "restore")
  }
}
