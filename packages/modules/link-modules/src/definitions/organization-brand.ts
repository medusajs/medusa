import { defineLink } from "@medusajs/framework/utils"
import OrganizationModule from "@medusajs/organization"
import BrandModule from "@medusajs/brand"

export default defineLink(
  { linkable: OrganizationModule.linkable.organization },
  { linkable: BrandModule.linkable.brand }
)
