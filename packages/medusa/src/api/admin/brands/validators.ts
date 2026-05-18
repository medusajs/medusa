import { z } from "zod"

export const AdminCreateBrand = z.object({
  name: z.string(),
  slug: z.string(),
  logo_url: z.string().optional(),
  description: z.string().optional(),
  org_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminCreateBrandType = z.infer<typeof AdminCreateBrand>

export const AdminUpdateBrand = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  logo_url: z.string().optional(),
  description: z.string().optional(),
  org_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AdminUpdateBrandType = z.infer<typeof AdminUpdateBrand>
