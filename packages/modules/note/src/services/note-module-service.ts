import {
  INoteModuleService,
  ModuleJoinerConfig,
  NoteDTO,
} from "@medusajs/framework/types"
import { MedusaService } from "@medusajs/framework/utils"
import { Note } from "@models"
import { joinerConfig } from "../joiner-config"

export class NoteModuleService
  extends MedusaService<{
    Note: { dto: NoteDTO }
  }>({ Note })
  implements INoteModuleService
{
  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }
}
