import { useAdminCreateTaxRate } from "medusa-react"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Modal from "../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import {
  EditTaxRateDetails,
  EditTaxRateFormType,
} from "./edit-tax-rate-details"
import { TaxRuleItem } from "./tax-rule-item"
import TaxRuleSelector from "./tax-rule-selector"

type NewTaxRateProps = {
  regionId: string
  onDismiss: () => void
}

type NewTaxRateFormData = {
  details: EditTaxRateFormType
  shipping_options: string[]
  product_types: string[]
  products: string[]
}

const NewTaxRate = ({ regionId, onDismiss }: NewTaxRateProps) => {
  const { t } = useTranslation()
  const { mutate, isLoading } = useAdminCreateTaxRate()
  const form = useForm<NewTaxRateFormData>({
    defaultValues: {
      products: [],
      product_types: [],
      shipping_options: [],
    },
  })
  const { setValue, handleSubmit, watch } = form
  const notification = useNotification()

  const layeredModalContext = useContext(LayeredModalContext)

  const onSave = handleSubmit((data) => {
    mutate(
      {
        product_types: data.product_types,
        products: data.products,
        shipping_options: data.shipping_options,
        name: data.details.name,
        code: data.details.code,
        rate: data.details.rate,
        region_id: regionId,
      },
      {
        onSuccess: () => {
          notification(
            t("Success"),
            t("Successfully created tax rate."),
            "success"
          )
          onDismiss()
        },
        onError: (error) => {
          notification(t("Error"), getErrorMessage(error), "error")
        },
      }
    )
  })

  const [products, product_types, shipping_options] = watch([
    "products",
    "product_types",
    "shipping_options",
  ])

  const handleOverridesSelected = (rule) => {
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
    <LayeredModal
      isLargeModal
      context={layeredModalContext}
      handleClose={onDismiss}
    >
      <form onSubmit={onSave}>
        <Modal.Body>
          <Modal.Header handleClose={onDismiss}>
            <div>
              <h1 className="inter-xlarge-semibold">{t("Add Tax Rate")}</h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <EditTaxRateDetails form={nestedForm(form, "details")} />
            <div>
              <p className="inter-base-semibold mb-base">{t("Overrides")}</p>
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
                        layeredModalContext.push(
                          SelectOverridesScreen(
                            layeredModalContext.pop,
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
                      name={t("Product Rules")}
                      description={t("Applies to {count} productWithCount", {
                        count: products.length,
                      })}
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
                        layeredModalContext.push(
                          SelectOverridesScreen(
                            layeredModalContext.pop,
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
                      name={t("Product Type Rules")}
                      description={t(
                        "Applies to {count} product typeWithCount",
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
                        layeredModalContext.push(
                          SelectOverridesScreen(
                            layeredModalContext.pop,
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
                      name={t("Shipping Option Rules")}
                      description={t(
                        "Applies to {count} shipping optionWithCount",
                        {
                          count: shipping_options.length,
                        }
                      )}
                    />
                  )}
                </div>
              )}
              {!(
                product_types.length > 0 &&
                products.length > 0 &&
                shipping_options.length > 0
              ) && (
                <Button
                  type="button"
                  onClick={() => {
                    layeredModalContext.push(
                      SelectOverridesScreen(
                        layeredModalContext.pop,
                        regionId,
                        handleOverridesSelected
                      )
                    )
                  }}
                  className="mt-base w-full"
                  size="medium"
                  variant="secondary"
                >
                  <PlusIcon /> {t("Add Overrides")}
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
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="w-eventButton justify-center"
                loading={isLoading}
                disabled={isLoading}
              >
                {t("Create")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </LayeredModal>
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

export default NewTaxRate
