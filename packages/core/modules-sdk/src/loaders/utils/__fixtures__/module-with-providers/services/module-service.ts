import { InternalModuleDeclaration } from "@medusajs/types"

export class ModuleService {
  constructor(
    public container: Record<any, any>,
    public moduleOptions: Record<any, any>,
    public moduleDeclaration: InternalModuleDeclaration
  ) {}
}
