import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

const SalesType = z.enum(["normal", "combo", "gift", "choice", "box", "lucky_bag"])
const SourceType = z.enum(["local", "api"])
const StatusType = z.enum(["active", "inactive"])

export const AdminCreateSalesMaterial = z.object({
  shop_id: z.string(),
  sales_code: z.string(),
  sales_name: z.string(),
  sales_type: SalesType.optional(),
  basic_material_id: z.string().optional(),
  is_bound: z.boolean().optional(),
  customer_class_id: z.string().optional(),
  org_id: z.string().optional(),
  tax_rate: z.number().optional(),
  tax_name: z.string().optional(),
  tax_code: z.string().optional(),
  source: SourceType.optional(),
  status: StatusType.optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminCreateSalesMaterialType = z.infer<typeof AdminCreateSalesMaterial>

export const AdminUpdateSalesMaterial = z.object({
  shop_id: z.string().optional(),
  sales_code: z.string().optional(),
  sales_name: z.string().optional(),
  sales_type: SalesType.optional(),
  basic_material_id: z.string().optional(),
  is_bound: z.boolean().optional(),
  customer_class_id: z.string().optional(),
  org_id: z.string().optional(),
  tax_rate: z.number().optional(),
  tax_name: z.string().optional(),
  tax_code: z.string().optional(),
  source: SourceType.optional(),
  status: StatusType.optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminUpdateSalesMaterialType = z.infer<typeof AdminUpdateSalesMaterial>

export const AdminGetSalesMaterialParams = createSelectParams()

export const AdminGetSalesMaterialsParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    shop_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    sales_code: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    sales_name: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    sales_type: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    basic_material_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    customer_class_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    org_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    source: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    status: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)
