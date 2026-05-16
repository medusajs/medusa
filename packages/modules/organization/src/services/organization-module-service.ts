import { MedusaService } from "@medusajs/framework/utils"
import Organization from "../models/organization"
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "../types"

export class OrganizationModuleService extends MedusaService<{
  Organization: { dto: CreateOrganizationDTO; updateDto: UpdateOrganizationDTO }
}>({ Organization }) {}
