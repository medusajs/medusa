import { moduleDefinition } from "./module-definition"

export default moduleDefinition

export const runMigrations = moduleDefinition.runMigrations
export const revertMigration = moduleDefinition.revertMigration

export * from "./initialize"
export * from "./types"
export * from "./loaders"
export * from "./models"
export * from "./services"
