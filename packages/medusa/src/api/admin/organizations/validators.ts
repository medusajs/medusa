import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

const OrgType = z.enum(["brand_bu", "operation", "department"])
const StatusType = z.enum(["active", "inactive"])

export const AdminCreateOrganization = z.object({
  name: z.string(),
  code: z.string(),
  parent_id: z.string().optional(),
  org_type: OrgType,
  status: StatusType.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminCreateOrganizationType = z.infer<typeof AdminCreateOrganization>

export const AdminUpdateOrganization = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  parent_id: z.string().optional(),
  org_type: OrgType.optional(),
  status: StatusType.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminUpdateOrganizationType = z.infer<typeof AdminUpdateOrganization>

export const AdminGetOrganizationParams = createSelectParams()

export const AdminGetOrganizationsParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(
  z.object({
    q: z.string().optional(),
    id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    name: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    code: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    parent_id: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    org_type: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    status: z.union([z.string(), z.array(z.string()), createOperatorMap()]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)
