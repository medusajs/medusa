import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useCollections } from "../../../hooks/api/collections"
import { useCustomerGroups } from "../../../hooks/api/customer-groups"
import { useProductTypes } from "../../../hooks/api/product-types"
import { useProducts } from "../../../hooks/api/products"
import { useTags } from "../../../hooks/api/tags"
import { useTaxRate } from "../../../hooks/api/tax-rates"
import { RuleReferenceType } from "../common/constants"
import { TaxRegionTaxOverrideEditForm } from "./components/tax-region-tax-override-edit-form"
import { InitialRuleValues } from "./types"

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
    [key in RuleReferenceType]: string[]
  } = {
    [RuleReferenceType.PRODUCT]: [],
    [RuleReferenceType.PRODUCT_COLLECTION]: [],
    [RuleReferenceType.PRODUCT_TAG]: [],
    [RuleReferenceType.PRODUCT_TYPE]: [],
    [RuleReferenceType.CUSTOMER_GROUP]: [],
  }

  rules.forEach((rule) => {
    const reference = rule.reference as RuleReferenceType
    idsByReferenceType[reference]?.push(rule.reference_id)
  })

  const queries = [
    {
      ids: idsByReferenceType[RuleReferenceType.PRODUCT],
      hook: useProducts,
      key: RuleReferenceType.PRODUCT,
      getResult: (result: HttpTypes.AdminProductListResponse) =>
        result.products.map((product) => ({
          label: product.title,
          value: product.id,
        })),
    },
    {
      ids: idsByReferenceType[RuleReferenceType.PRODUCT_COLLECTION],
      hook: useCollections,
      key: RuleReferenceType.PRODUCT_COLLECTION,
      getResult: (result: HttpTypes.AdminCollectionListResponse) =>
        result.collections.map((collection) => ({
          label: collection.title!,
          value: collection.id!,
        })),
    },
    {
      ids: idsByReferenceType[RuleReferenceType.PRODUCT_TAG],
      hook: useTags,
      key: RuleReferenceType.PRODUCT_TAG,
      getResult: (result: any) =>
        result.tags.map((tag: any) => ({
          label: tag.value,
          value: tag.id,
        })),
    },
    {
      ids: idsByReferenceType[RuleReferenceType.PRODUCT_TYPE],
      hook: useProductTypes,
      key: RuleReferenceType.PRODUCT_TYPE,
      getResult: (result: HttpTypes.AdminProductTypeListResponse) =>
        result.product_types.map((productType) => ({
          label: productType.value,
          value: productType.id,
        })),
    },
    {
      ids: idsByReferenceType[RuleReferenceType.CUSTOMER_GROUP],
      hook: useCustomerGroups,
      key: RuleReferenceType.CUSTOMER_GROUP,
      getResult: (
        result: HttpTypes.PaginatedResponse<{
          customer_groups: HttpTypes.AdminCustomerGroup[]
        }>
      ) =>
        result.customer_groups.map((customerGroup) => ({
          label: customerGroup.name!,
          value: customerGroup.id,
        })),
    },
  ]

  const queryResults = queries.map(({ ids, hook }) => {
    const enabled = ids.length > 0
    return {
      result: hook({ id: ids, limit: ids.length }, { enabled }),
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
    (acc, { key, getResult }, index) => ({
      ...acc,
      [key]: queryResults[index].enabled
        ? getResult(queryResults[index].result)
        : [],
    }),
    {} as InitialRuleValues
  )

  return { initialValues: initialRulesValues, isPending: false }
}
