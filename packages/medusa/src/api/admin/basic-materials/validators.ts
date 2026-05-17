import { z } from "zod"
import { createFindParams, createOperatorMap } from "../../utils/validators"

const MaterialType = z.enum(["finished", "semi", "normal", "box", "virtual"])
const SourceType = z.enum(["local", "api"])

export const AdminCreateBasicMaterial = z.object({
  material_code: z.string(),
  material_name: z.string(),
  spu_code: z.string().optional(),
  material_type: MaterialType.optional(),
  category_id: z.string().optional(),
  sn_managed: z.boolean().optional(),
  stock_controlled: z.boolean().optional(),
  tax_rate: z.number().optional(),
  tax_name: z.string().optional(),
  tax_code: z.string().optional(),
  omnichannel: z.boolean().optional(),
  o2o_enabled: z.boolean().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  source: SourceType.optional(),
  org_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminCreateBasicMaterialType = z.infer<typeof AdminCreateBasicMaterial>

export const AdminUpdateBasicMaterial = z.object({
  material_code: z.string().optional(),
  material_name: z.string().optional(),
  spu_code: z.string().optional(),
  material_type: MaterialType.optional(),
  category_id: z.string().optional(),
  sn_managed: z.boolean().optional(),
  stock_controlled: z.boolean().optional(),
  tax_rate: z.number().optional(),
  tax_name: z.string().optional(),
  tax_code: z.string().optional(),
  omnichannel: z.boolean().optional(),
  o2o_enabled: z.boolean().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  source: SourceType.optional(),
  org_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminUpdateBasicMaterialType = z.infer<typeof AdminUpdateBasicMaterial>

export const AdminGetBasicMaterialParams = createFindParams()

export const AdminGetBasicMaterialsParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    material_code: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    material_name: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    spu_code: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    material_type: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    category_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    source: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    org_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
  })
)
