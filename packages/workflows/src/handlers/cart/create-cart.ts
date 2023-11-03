import { CartDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"
import { IsolatePricingDomainFeatureFlag } from "@medusajs/utils"

enum Aliases {
  SalesChannel = "SalesChannel",
  Addresses = "addresses",
  Customer = "customer",
  Region = "region",
  Context = "context",
}

type HandlerInputData = {
  sales_channel: {
    sales_channel_id?: string
  }
  addresses: {
    shipping_address_id: string
    billing_address_id: string
  }
  customer: {
    customer_id?: string
    email?: string
  }
  region: {
    region_id: string
  }
  context: {
    context: Record<any, any>
  }
}

type HandlerOutputData = {
  cart: CartDTO
}

export async function createCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<HandlerOutputData> {
  const { manager } = context

  const cartService = container.resolve("cartService")
  const featureFlagRouter = container.resolve("featureFlagRouter")
  const cartServiceTx = cartService.withTransaction(manager)

  const payload = {
    ...data[Aliases.SalesChannel],
    ...data[Aliases.Addresses],
    ...data[Aliases.Customer],
    ...data[Aliases.Region],
    ...data[Aliases.Context],
  }

  if (featureFlagRouter.isFeatureEnabled(IsolatePricingDomainFeatureFlag.key)) {
    delete payload[Aliases.SalesChannel]
  }

  return await cartServiceTx.create(payload)
}

createCart.aliases = Aliases
