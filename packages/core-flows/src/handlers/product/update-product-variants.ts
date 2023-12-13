import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductTypes, UpdateProductVariantOnlyDTO } from "@medusajs/types"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type HandlerInput = {
  productVariantsMap: Map<string, ProductTypes.UpdateProductVariantDTO[]>
}

export async function updateProductVariants({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<
  ProductTypes.UpdateProductVariantDTO[]
> {
  const { productVariantsMap } = data
  const productsVariants: ProductTypes.UpdateProductVariantDTO[] = []
  const updateVariantsData: ProductTypes.UpdateProductVariantOnlyDTO[] = []
  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  for (const [
    product_id,
    variantsUpdateData = [],
  ] of productVariantsMap) {
    updateVariantsData.push(
      ...(variantsUpdateData as unknown as UpdateProductVariantOnlyDTO[]).map(
        (update) => ({ ...update, product_id })
      )
    )

    productsVariants.push(...variantsUpdateData)
  }

  if (updateVariantsData.length) {
    await productModuleService.updateVariants(updateVariantsData)
  }

  return productsVariants
}

updateProductVariants.aliases = {
  payload: "payload",
}
