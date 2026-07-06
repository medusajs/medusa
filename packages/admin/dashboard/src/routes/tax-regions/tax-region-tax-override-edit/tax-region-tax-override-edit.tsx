import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useProductTypes } from "../../../hooks/api/product-types"
import { useProducts } from "../../../hooks/api/products"
import { TaxRateRuleReferenceType } from "../common/constants"
import {
  DISPLAY_OVERRIDE_ITEMS_LIMIT,
  TaxRegionTaxOverrideEditForm,
} from "./components/tax-region-tax-override-edit-form"
import { InitialRuleValues } from "./types"
import { useShippingOptions, useTaxRate } from "../../../hooks/api"
import { TaxRateRuleReference } from "../common/schemas"

export const TaxRegionTaxOverrideEdit = () => {
  const { t } = useTranslation()
  const { tax_rate_id } = useParams()

  const { tax_rate, isPending, isError, error } = useTaxRate(tax_rate_id!)

  const { initialValues, isPending: isInitializing } =
    useDefaultRulesValues(tax_rate)

  const ready = !isPending && !!tax_rate && !isInitializing && !!initialValues

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("taxRegions.taxOverrides.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("taxRegions.taxOverrides.edit.hint")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ready && (
        <TaxRegionTaxOverrideEditForm
          taxRate={tax_rate}
          isCombinable={true}
          initialValues={initialValues}
        />
      )}
    </RouteDrawer>
  )
}

const useDefaultRulesValues = (
  taxRate?: HttpTypes.AdminTaxRate
): { initialValues?: InitialRuleValues; isPending: boolean } => {
  const rules = taxRate?.rules || []

  const idsByReferenceType: {
    [key in TaxRateRuleReferenceType]: string[]
  } = {
    [TaxRateRuleReferenceType.PRODUCT]: [],
    // [TaxRateRuleReferenceType.PRODUCT_COLLECTION]: [],
    // [TaxRateRuleReferenceType.PRODUCT_TAG]: [],
    [TaxRateRuleReferenceType.PRODUCT_TYPE]: [],
    [TaxRateRuleReferenceType.SHIPPING_OPTION]: [],
    // [TaxRateRuleReferenceType.CUSTOMER_GROUP]: [],
  }

  rules
    .sort((a, b) => a.created_at.localeCompare(b.created_at)) // preffer newer rules for display
    .forEach((rule) => {
      const reference = rule.reference as TaxRateRuleReferenceType
      idsByReferenceType[reference]?.push(rule.reference_id)
    })

  const queries = [
    {
      ids: idsByReferenceType[TaxRateRuleReferenceType.PRODUCT],
      hook: useProducts,
      key: TaxRateRuleReferenceType.PRODUCT,
      getResult: (result: HttpTypes.AdminProductListResponse) =>
        result.products.map((product) => ({
          label: product.title,
          value: product.id,
        })),
    },
    // {
    //   ids: idsByReferenceType[TaxRateRuleReferenceType.PRODUCT_COLLECTION],
    //   hook: useCollections,
    //   key: TaxRateRuleReferenceType.PRODUCT_COLLECTION,
    //   getResult: (result: HttpTypes.AdminCollectionListResponse) =>
    //     result.collections.map((collection) => ({
    //       label: collection.title!,
    //       value: collection.id!,
    //     })),
    // },
    // {
    //   ids: idsByReferenceType[TaxRateRuleReferenceType.PRODUCT_TAG],
    //   hook: useProductTags,
    //   key: TaxRateRuleReferenceType.PRODUCT_TAG,
    //   getResult: (result: any) =>
    //     result.tags.map((tag: any) => ({
    //       label: tag.value,
    //       value: tag.id,
    //     })),
    // },
    {
      ids: idsByReferenceType[TaxRateRuleReferenceType.PRODUCT_TYPE],
      hook: useProductTypes,
      key: TaxRateRuleReferenceType.PRODUCT_TYPE,
      getResult: (result: HttpTypes.AdminProductTypeListResponse) =>
        result.product_types.map((productType) => ({
          label: productType.value,
          value: productType.id,
        })),
    },
    {
      ids: idsByReferenceType[TaxRateRuleReferenceType.SHIPPING_OPTION],
      hook: useShippingOptions,
      key: TaxRateRuleReferenceType.SHIPPING_OPTION,
      getResult: (result: HttpTypes.AdminShippingOptionListResponse) =>
        result.shipping_options.map((shippingOption) => ({
          label: shippingOption.name,
          value: shippingOption.id,
        })),
    },
    // {
    //   ids: idsByReferenceType[TaxRateRuleReferenceType.CUSTOMER_GROUP],
    //   hook: useCustomerGroups,
    //   key: TaxRateRuleReferenceType.CUSTOMER_GROUP,
    //   getResult: (
    //     result: HttpTypes.PaginatedResponse<{
    //       customer_groups: HttpTypes.AdminCustomerGroup[]
    //     }>
    //   ) =>
    //     result.customer_groups.map((customerGroup) => ({
    //       label: customerGroup.name!,
    //       value: customerGroup.id,
    //     })),
    // },
  ]

  const queryResults = queries.map(({ ids, hook }) => {
    const enabled = ids.length > 0

    return {
      result: hook(
        {
          /**
           * Limit fetch to 10 resources for display
           */
          id:
            ids.length > DISPLAY_OVERRIDE_ITEMS_LIMIT
              ? ids.slice(0, DISPLAY_OVERRIDE_ITEMS_LIMIT)
              : ids,
          limit: DISPLAY_OVERRIDE_ITEMS_LIMIT,
        },
        { enabled }
      ),
      enabled,
    }
  })

  if (!taxRate) {
    return { isPending: true }
  }

  const isPending = queryResults.some(
    ({ result, enabled }) => enabled && result.isPending
  )

  if (isPending) {
    return { isPending }
  }

  queryResults.forEach(({ result, enabled }) => {
    if (enabled && result.isError) {
      throw result.error
    }
  })

  const initialRulesValues: InitialRuleValues = queries.reduce(
    (acc, { key, getResult }, index) => {
      let initialValues: TaxRateRuleReference[] = []

      if (queryResults[index].enabled) {
        const fetchedEntityList = getResult(queryResults[index].result as any)

        const entityIdMap = new Map(
          fetchedEntityList.map((entity) => [entity.value, entity])
        )

        const initialIds = idsByReferenceType[key]

        initialValues = initialIds.map((id) => ({
          value: id,
          label: entityIdMap.get(id)?.label || "",
        }))
      }

      return {
        ...acc,
        [key]: initialValues,
      }
    },
    {} as InitialRuleValues
  )

  return { initialValues: initialRulesValues, isPending: false }
}
