import { ProductTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

export async function extractVariants({
  data,
}: WorkflowArguments<{
  object: { variants?: ProductTypes.ProductVariantDTO[] }[]
}>) {
  const variants = data.object.reduce((acc, object) => {
    if (object.variants?.length) {
      return acc.concat(object.variants)
    }
    return acc
  }, [] as ProductTypes.ProductVariantDTO[])

  return {
    alias: extractVariants.aliases.output,
    value: {
      variants,
    },
  }
}

extractVariants.aliases = {
  output: "extractVariantsFromProductOutput",
  object: "object",
}
