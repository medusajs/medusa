import {
  moduleDefinition,
  revertMigration,
  runMigrations,
} from "./module-definition"

export default moduleDefinition
export { revertMigration, runMigrations }

export * from "./initialize"
// TODO: remove models exported from here
export * from "./models"
export * from "./types"
