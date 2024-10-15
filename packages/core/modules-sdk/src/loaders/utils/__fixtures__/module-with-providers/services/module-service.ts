import { IModuleService, InternalModuleDeclaration } from "@medusajs/types"

export class ModuleService implements IModuleService {
  constructor(
    public container: Record<any, any>,
    public moduleOptions: Record<any, any>,
    public moduleDeclaration: InternalModuleDeclaration
  ) {}
}
