import { AdminPostTaxRatesTaxRateReq, TaxRate } from "@medusajs/medusa"
import { useAdminUpdateRegion, useAdminUpdateTaxRate } from "medusa-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Modal from "../../../components/molecules/modal"
import { ILayeredModalContext } from "../../../components/molecules/modal/layered-modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import {
  EditTaxRateDetails,
  EditTaxRateFormType,
} from "./edit-tax-rate-details"
import { TaxRuleItem } from "./tax-rule-item"
import TaxRuleSelector from "./tax-rule-selector"

type EditTaxRateProps = {
  taxRate: TaxRate
  regionId: string
  modalContext: ILayeredModalContext
  onDismiss: () => void
}

export interface EditTaxRateFormData extends SimpleEditFormData {
  products: string[]
  product_types: string[]
  shipping_options: string[]
}

const EditTaxRate = ({
  modalContext,
  regionId,
  taxRate,
  onDismiss,
}: EditTaxRateProps) => {
  const { t } = useTranslation()
  const { mutate, isLoading } = useAdminUpdateTaxRate(taxRate.id)

  const [updatedRules, setUpdatedRules] = useState({})
  const form = useForm<EditTaxRateFormData>({
    defaultValues: {
      details: {
        name: taxRate.name,
        code: taxRate.code || undefined,
        rate: taxRate.rate || undefined,
      },
      products: taxRate.products.map((p) => p.id),
      product_types: taxRate.product_types.map((p) => p.id),
      shipping_options: taxRate.shipping_options.map((p) => p.id),
    },
  })
  const { register, setValue, handleSubmit, watch } = form
  const notification = useNotification()

  const onSave = handleSubmit((data) => {
    const toSubmit: AdminPostTaxRatesTaxRateReq = {
      name: data.details.name,
      code: data.details.code,
      rate: data.details.rate,
      product_types: data.product_types,
      products: data.products,
      shipping_options: data.shipping_options,
    }
    const conditionalFields = ["products", "product_types", "shipping_options"]

    for (const [key, value] of Object.entries(updatedRules)) {
      if (!value && key in toSubmit && conditionalFields.includes(key)) {
        delete toSubmit[key]
      }
    }

    mutate(toSubmit, {
      onSuccess: () => {
        notification(
          t("taxes-success", "Success"),
          t(
            "taxes-successfully-updated-tax-rate",
            "Successfully updated Tax Rate."
          ),
          "success"
        )
        onDismiss()
      },
      onError: (error) => {
        notification(t("taxes-error", "Error"), getErrorMessage(error), "error")
      },
    })
  })

  useEffect(() => {
    register("products")
    register("product_types")
    register("shipping_options")
  }, [])

  const [products, product_types, shipping_options] = watch([
    "products",
    "product_types",
    "shipping_options",
  ])

  const handleOverridesSelected = (rule) => {
    setUpdatedRules((prev) => {
      prev[rule.type] = true
      return prev
    })
    switch (rule.type) {
      case "products":
        setValue("products", rule.items)
        break
      case "product_types":
        setValue("product_types", rule.items)
        break
      case "shipping_options":
        setValue("shipping_options", rule.items)
        break
      default:
        break
    }
  }

  return (
    <form onSubmit={onSave}>
      <Modal.Content>
        <div className="mb-xlarge">
          <EditTaxRateDetails form={nestedForm(form, "details")} />
        </div>
        <div>
          <p className="inter-base-semibold mb-base">
            {t("taxes-overrides", "Overrides")}
          </p>
          {(product_types.length > 0 ||
            products.length > 0 ||
            shipping_options.length > 0) && (
            <div className="gap-base flex flex-col">
              {products.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({ type: "products", items: [] })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: products,
                          type: "products",
                        }
                      )
                    )
                  }}
                  index={1}
                  name={t("taxes-product-rules", "Product Rules")}
                  description={t(
                    "taxes-product-rules-description",
                    "Applies to {{count}} productWithCount",
                    {
                      count: products.length,
                    }
                  )}
                />
              )}
              {product_types.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({
                      type: "product_types",
                      items: [],
                    })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: product_types,
                          type: "product_types",
                        }
                      )
                    )
                  }}
                  index={2}
                  name={t("taxes-product-type-rules", "Product Type Rules")}
                  description={t(
                    "taxes-product-type-rules-description",
                    "Applies to {{count}} product typeWithCount",
                    {
                      count: product_types.length,
                    }
                  )}
                />
              )}
              {shipping_options.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({
                      type: "shipping_options",
                      items: [],
                    })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: shipping_options,
                          type: "shipping_options",
                        }
                      )
                    )
                  }}
                  index={3}
                  name={t(
                    "taxes-shipping-option-rules",
                    "Shipping Option Rules"
                  )}
                  description={t(
                    "taxes-applies-to-shipping-option-with-count",
                    "Applies to {{count}} shipping optionWithCount",
                    {
                      count: shipping_options.length,
                    }
                  )}
                />
              )}
            </div>
          )}
          {!(
            product_types.length &&
            products.length &&
            shipping_options.length
          ) && (
            <Button
              type="button"
              onClick={() => {
                modalContext.push(
                  SelectOverridesScreen(
                    modalContext.pop,
                    regionId,
                    handleOverridesSelected
                  )
                )
              }}
              className="mt-base w-full"
              size="medium"
              variant="secondary"
            >
              <PlusIcon /> {t("taxes-add-overrides", "Add Overrides")}
            </Button>
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full items-center justify-end">
          <Button
            type="button"
            onClick={onDismiss}
            variant="ghost"
            size="small"
            className="w-eventButton justify-center"
          >
            {t("taxes-cancel", "Cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="small"
            className="w-eventButton justify-center"
            loading={isLoading}
            disabled={isLoading}
          >
            {t("taxes-save", "Save")}
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

const SelectOverridesScreen = (
  pop,
  regionId,
  onOverridesSelected,
  options = {}
) => {
  return {
    title: "Add override",
    onBack: () => pop(),
    view: (
      <TaxRuleSelector
        regionId={regionId}
        onSubmit={onOverridesSelected}
        {...options}
      />
    ),
  }
}

type SimpleEditFormProps = {
  onDismiss: () => void
  taxRate: TaxRate
}

export interface SimpleEditFormData {
  details: EditTaxRateFormType
}

export const SimpleEditForm = ({ onDismiss, taxRate }: SimpleEditFormProps) => {
  const { mutate, isLoading } = useAdminUpdateRegion(taxRate.id)

  const form = useForm<SimpleEditFormData>({
    defaultValues: {
      details: {
        name: taxRate.name,
        rate: taxRate.rate || undefined,
        code: taxRate.code || undefined,
      },
    },
  })
  const { handleSubmit } = form
  const notification = useNotification()

  const onSave = (data: SimpleEditFormData) => {
    const toSubmit = {
      tax_rate: data.details.rate,
      tax_code: data.details.code,
    }
    mutate(toSubmit, {
      onSuccess: () => {
        notification("Success", "Successfully updated default rate.", "success")
        onDismiss()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Modal.Content>
        <EditTaxRateDetails form={nestedForm(form, "details")} lockName />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full items-center justify-end">
          <Button
            type="button"
            onClick={onDismiss}
            variant="ghost"
            size="small"
            className="w-eventButton justify-center"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="small"
            className="w-eventButton justify-center"
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

export default EditTaxRate
