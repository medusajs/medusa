import { ExclamationCircle, Spinner } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Button, Heading, Input, Text } from "@medusajs/ui"
import { useAdminProducts } from "medusa-react"
import * as React from "react"

import { useTranslation } from "react-i18next"
import { Form } from "../../../../components/helpers/form"
import { useDebounce } from "../../../../hooks/use-debounce"
import { NestedForm } from "../../../../utils/nested-form"
import { ProductFilter, ProductFilterMenu } from "../../components"
import { PriceListPricesSchema } from "./types"

type PriceListPricesFormProps = {
  form: NestedForm<PriceListPricesSchema>
  setProduct: (product: Product | null) => void
  productIds: string[]
  priceListId?: string
}

const PriceListPricesForm = ({
  form,
  setProduct,
  productIds,
  priceListId,
}: PriceListPricesFormProps) => {
  const {
    control,
    path,
    getValues,
    formState: { isDirty },
  } = form

  const { t } = useTranslation()

  const [filters, setFilters] = React.useState<ProductFilter>({})
  const [query, setQuery] = React.useState("")

  const debouncedQuery = useDebounce(query, 500)

  const {
    products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useAdminProducts(
    {
      id: productIds,
      q: debouncedQuery,
      price_list_id: priceListId ? [priceListId] : undefined,
      ...filters,
      expand: "variants.prices",
    },
    {
      keepPreviousData: true,
      enabled: !!productIds?.length,
    }
  )

  const errorMessage = t(
    "price-list-prices-form-products-error",
    "An error occurred while preparing the form. Reload the page and try again. If the issue persists, try again later."
  )

  if (isErrorProducts) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex items-center gap-x-2">
          <ExclamationCircle />
          <Text className="text-ui-fg-subtle">{errorMessage}</Text>
        </div>
      </div>
    )
  }

  if (isLoadingProducts) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="animate-spin" />
      </div>
    )
  }

  if (!products) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-x-2">
        <ExclamationCircle />
        <Text className="text-ui-fg-subtle">{errorMessage}</Text>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      <div>
        <div className="border-ui-border-base bg-ui-bg-base z-10 flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-x-3">
            <Heading>
              {t("price-list-prices-form-heading", "Edit prices")}
            </Heading>
            <Form.Field
              control={control}
              name={path("products")}
              render={() => {
                return (
                  <Form.Item>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
          <div className="flex items-center gap-x-2">
            <ProductFilterMenu
              onClearFilters={() => setFilters({})}
              value={filters}
              onFilterChange={setFilters}
            />
            <Input
              type="search"
              placeholder="Search"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="border-ui-border-base border-b">
          <table className="w-full text-start">
            <thead>
              <tr className="[&_th]:text-ui-fg-subtle [&_th]:txt-compact-small-plus border-ui-border-base [&_th:last-of-type]:border-e-0 [&_th]:w-1/3 [&_th]:border-e [&_th]:px-4 [&_th]:py-2.5">
                <th>{t("price-list-prices-form-variant", "Variant")}</th>
                <th>{t("price-list-prices-form-sku", "SKU")}</th>
                <th className="text-end">
                  {t("price-list-prices-form-prices", "Prices")}
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div className="relative flex h-full flex-1 flex-col overflow-y-auto">
        {products.map((product) => {
          return (
            <div key={product.id}>
              <div className="bg-ui-bg-subtle border-ui-border-base sticky top-0 flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-x-4">
                  <div className="bg-ui-bg-subtle h-10 w-[30px] overflow-hidden rounded-md">
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <Text size="small" weight="plus">
                      {product.title}
                    </Text>
                    <Text size="small" className="text-ui-fg-subtle">
                      {t(
                        "price-list-prices-form-prices-variant-count",
                        "{{count}} variants",
                        {
                          count: product.variants.length,
                        }
                      )}
                    </Text>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setProduct(product as Product)
                  }}
                >
                  {t("price-list-prices-form-add-prices-button", "Add prices")}
                </Button>
              </div>
              <table className="w-full">
                <tbody>
                  {product.variants.map((variant) => {
                    let count = 0

                    const setPrices = getValues(
                      path(`products.${product.id}.variants.${variant.id}`)
                    )

                    if (setPrices) {
                      if (setPrices.currency) {
                        for (const key of Object.keys(setPrices.currency)) {
                          const item = setPrices.currency[key]
                          if (item.amount) {
                            count++
                          }
                        }
                      }

                      if (setPrices.region) {
                        for (const key of Object.keys(setPrices.region)) {
                          const item = setPrices.region[key]
                          if (item.amount) {
                            count++
                          }
                        }
                      }
                    }

                    return (
                      <tr
                        key={variant.id}
                        className="[&_td]:text-ui-fg-subtle [&_td]:txt-compact-small border-ui-border-base border-b [&_td:last-of-type]:border-e-0 [&_td]:w-1/3 [&_td]:border-e [&_td]:px-4 [&_td]:py-2.5"
                      >
                        <td>{variant.title}</td>
                        <td>{variant.sku ? variant.sku : "-"}</td>
                        <td className="text-end">
                          {t(
                            "price-list-prices-form-prices-count",
                            "{{count}} prices",
                            {
                              count,
                            }
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { PriceListPricesForm }
