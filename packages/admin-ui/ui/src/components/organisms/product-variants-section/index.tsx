import OptionsProvider, { useOptionsContext } from "./options-provider"
import { Product, ProductVariant, VariantInventory } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"

import { ActionType } from "../../molecules/actionables"
import AddVariantModal from "./add-variant-modal"
import EditIcon from "../../fundamentals/icons/edit-icon"
import EditVariantInventoryModal from "./edit-variant-inventory-modal"
import EditVariantModal from "./edit-variant-modal"
import EditVariantsModal from "./edit-variants-modal"
import GearIcon from "../../fundamentals/icons/gear-icon"
import OptionsModal from "./options-modal"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import Section from "../../organisms/section"
import VariantsTable from "./table"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { adminInventoryItemsKeys, useMedusa } from "medusa-react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import useToggleState from "../../../hooks/use-toggle-state"
import DollarSignIcon from "../../fundamentals/icons/dollar-sign-icon"
import Index from "./edit-prices-modal"

type Props = {
  product: Product
}

const ProductVariantsSection = ({ product }: Props) => {
  const queryClient = useQueryClient()
  const { client } = useMedusa()
  const { t } = useTranslation()

  const { isFeatureEnabled } = useFeatureFlag()

  const [variantToEdit, setVariantToEdit] = useState<
    | {
        base: ProductVariant
        isDuplicate: boolean
      }
    | undefined
  >(undefined)

  const [variantInventoryToEdit, setVariantInventoryToEdit] = useState<
    { base: ProductVariant } | undefined
  >(undefined)

  const {
    state: optionState,
    close: closeOptions,
    toggle: toggleOptions,
  } = useToggleState()

  const {
    state: addVariantState,
    close: closeAddVariant,
    toggle: toggleAddVariant,
  } = useToggleState()

  const {
    state: editVariantsState,
    close: closeEditVariants,
    toggle: toggleEditVariants,
  } = useToggleState()

  const {
    state: showEditPrices,
    close: hideEditPrices,
    toggle: toggleEditPrices,
  } = useToggleState()

  const actions: ActionType[] = [
    {
      label: t("product-variants-section-add-variant", "Add Variant"),
      onClick: toggleAddVariant,
      icon: <PlusIcon size="20" />,
    },
    {
      label: t("product-variants-section-edit-prices", "Edit Prices"),
      onClick: toggleEditPrices,
      icon: <DollarSignIcon size="20" />,
    },
    {
      label: t("product-variants-section-edit-variants", "Edit Variants"),
      onClick: toggleEditVariants,
      icon: <EditIcon size="20" />,
    },
    {
      label: t("product-variants-section-edit-options", "Edit Options"),
      onClick: toggleOptions,
      icon: <GearIcon size="20" />,
    },
  ]

  const { onDeleteVariant } = useEditProductActions(product.id)

  const handleDeleteVariant = async (variantId: string) => {
    let variantInventory: VariantInventory | undefined
    if (isFeatureEnabled("inventoryService")) {
      const { variant } = await client.admin.variants.getInventory(variantId)
      variantInventory = variant
    }
    onDeleteVariant(variantId, async () => {
      if (
        isFeatureEnabled("inventoryService") &&
        variantInventory?.inventory[0]?.id
      ) {
        await client.admin.inventoryItems.delete(
          variantInventory.inventory[0].id
        )
        queryClient.invalidateQueries(adminInventoryItemsKeys.lists())
      }
    })
  }

  const handleEditVariant = (variant: ProductVariant) => {
    setVariantToEdit({ base: variant, isDuplicate: false })
  }

  const handleDuplicateVariant = (variant: ProductVariant) => {
    // @ts-ignore
    setVariantToEdit({ base: { ...variant, options: [] }, isDuplicate: true })
  }

  const handleEditVariantInventory = (variant: ProductVariant) => {
    setVariantInventoryToEdit({ base: variant })
  }

  return (
    <OptionsProvider product={product}>
      <Section title="Variants" actions={actions}>
        <ProductOptions />
        <div className="mt-xlarge">
          <h2 className="inter-large-semibold mb-base">
            {t("product-variants-section-product-variants", "Product variants")}{" "}
            <span className="inter-large-regular text-grey-50">
              ({product.variants.length})
            </span>
          </h2>
          <VariantsTable
            variants={product.variants}
            actions={{
              deleteVariant: handleDeleteVariant,
              updateVariant: handleEditVariant,
              duplicateVariant: handleDuplicateVariant,
              updateVariantInventory: handleEditVariantInventory,
            }}
          />
        </div>
      </Section>
      <OptionsModal
        open={optionState}
        onClose={closeOptions}
        product={product}
      />
      <AddVariantModal
        open={addVariantState}
        onClose={closeAddVariant}
        product={product}
      />
      <EditVariantsModal
        open={editVariantsState}
        onClose={closeEditVariants}
        product={product}
      />
      {showEditPrices && <Index close={hideEditPrices} product={product} />}
      {variantToEdit && (
        <EditVariantModal
          variant={variantToEdit.base}
          isDuplicate={variantToEdit.isDuplicate}
          product={product}
          onClose={() => setVariantToEdit(undefined)}
        />
      )}
      {variantInventoryToEdit && (
        <EditVariantInventoryModal
          variant={variantInventoryToEdit.base}
          product={product}
          onClose={() => setVariantInventoryToEdit(undefined)}
        />
      )}
    </OptionsProvider>
  )
}

const ProductOptions = () => {
  const { options, status } = useOptionsContext()

  if (status === "error") {
    return null
  }

  if (status === "loading" || !options) {
    return (
      <div className="mt-base grid grid-cols-3 gap-x-8">
        {Array.from(Array(2)).map((_, i) => {
          return (
            <div key={i}>
              <div className="mb-xsmall bg-grey-30 h-6 w-9 animate-pulse"></div>
              <ul className="flex flex-wrap items-center gap-1">
                {Array.from(Array(3)).map((_, j) => (
                  <li key={j}>
                    <div className="rounded-rounded bg-grey-10 text-grey-50 h-8 w-12 animate-pulse">
                      {j}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mt-base flex flex-wrap items-center gap-8">
      {options.map((option) => {
        return (
          <div key={option.id}>
            <h3 className="inter-base-semibold mb-xsmall">{option.title}</h3>
            <ul className="flex flex-wrap items-center gap-1">
              {option.values
                ?.map((val) => val.value)
                .filter((v, index, self) => self.indexOf(v) === index)
                .map((v, i) => (
                  <li key={i}>
                    <div className="inter-small-semibold rounded-rounded bg-grey-10 text-grey-50 whitespace-nowrap px-3 py-[6px]">
                      {v}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default ProductVariantsSection
