import { RemoteExpandProperty, RemoteJoinerQuery } from "../joiner"
import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  LoadedModule,
  MedusaContainer,
  ModuleJoinerConfig,
  ModuleServiceInitializeOptions,
} from "./common"

export type RunMigrationFn = (
  options?: ModuleServiceInitializeOptions,
  injectedDependencies?: Record<any, any>
) => Promise<void>

export type MedusaModuleConfig = {
  [key: string]:
    | boolean
    | Partial<InternalModuleDeclaration | ExternalModuleDeclaration>
}

export type SharedResources = {
  database?: ModuleServiceInitializeOptions["database"] & {
    /**
     * {
     *   name?: string
     *   afterCreate?: Function
     *   min?: number
     *   max?: number
     *   refreshIdle?: boolean
     *   idleTimeoutMillis?: number
     *   reapIntervalMillis?: number
     *   returnToHead?: boolean
     *   priorityRange?: number
     *   log?: (message: string, logLevel: string) => void
     * }
     */
    pool?: Record<string, unknown>
  }
}

export type MedusaAppOutput = {
  modules: Record<string, LoadedModule | LoadedModule[]>
  link: any // TODO: RemoteLink | undefined
  query: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
  entitiesMap?: Record<string, any>
  notFound?: Record<string, Record<string, string>>
  runMigrations: RunMigrationFn
  revertMigrations: RunMigrationFn
  onApplicationShutdown: () => Promise<void>
  onApplicationPrepareShutdown: () => Promise<void>
  listen?: (
    protocol: "http" | "grpc",
    port: number,
    options?: Record<string, any>
  ) => Promise<void>
}

type DefaultRemoteFetchDataCallback = (
  expand: RemoteExpandProperty,
  keyField: string,
  ids?: (unknown | unknown[])[],
  relationship?: any
) => Promise<{
  data: unknown[] | { [path: string]: unknown }
  path?: string
}>

export type MedusaAppOptions<TRemoteFetch = DefaultRemoteFetchDataCallback> = {
  workerMode?: "shared" | "worker" | "server"
  sharedContainer?: MedusaContainer
  sharedResourcesConfig?: SharedResources
  loadedModules?: LoadedModule[]
  servicesConfig?: ModuleJoinerConfig[]
  modulesConfigPath?: string
  modulesConfigFileName?: string
  modulesConfig?: MedusaModuleConfig
  linkModules?: ModuleJoinerConfig | ModuleJoinerConfig[]
  remoteFetchData?: TRemoteFetch
  injectedDependencies?: any
  onApplicationStartCb?: () => void

  /**
   * Forces the modules bootstrapper to only run the modules loaders and return prematurely
   */
  loaderOnly?: boolean
}
