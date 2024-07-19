import { UserModuleService } from "@services"
import { Module, Modules } from "@medusajs/utils"

declare module "@medusajs/types" {
  export interface RemoteQueryFieldsSchema {
    invite: {
      id: string
    }
  }
}

export default Module(Modules.USER, {
  service: UserModuleService,
})
