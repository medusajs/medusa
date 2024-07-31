import {
    ArrowDownRightMini,
    PencilSquare,
    Trash,
    TriangleRightMini,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, IconButton, StatusBadge, Text, Tooltip } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { ComponentPropsWithoutRef } from "react"
import { useTranslation } from "react-i18next"

import { FetchError } from "@medusajs/js-sdk"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Divider } from "../../../../../components/common/divider"
import { useCollections } from "../../../../../hooks/api/collections"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTags } from "../../../../../hooks/api/tags"
import { formatPercentage } from "../../../../../lib/percentage-helpers"
import { TaxRateRuleReferenceType } from "../../constants"
import { useDeleteTaxRateAction } from "../../hooks"

interface TaxOverrideCardProps extends ComponentPropsWithoutRef<"div"> {
  taxRate: HttpTypes.AdminTaxRate
}

export const TaxOverrideCard = ({ taxRate }: TaxOverrideCardProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteTaxRateAction(taxRate)

  if (taxRate.is_default) {
    return null
  }

  const groupedRules = taxRate.rules.reduce((acc, rule) => {
    if (!acc[rule.reference]) {
      acc[rule.reference] = []
    }

    acc[rule.reference].push(rule.reference_id)

    return acc
  }, {} as Record<string, string[]>)

  const validKeys = Object.values(TaxRateRuleReferenceType)
  const numberOfTargets = Object.keys(groupedRules).map((key) =>
    validKeys.includes(key as TaxRateRuleReferenceType)
  ).length

  return (
    <Collapsible.Root>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-x-2">
          <Collapsible.Trigger asChild>
            <IconButton size="2xsmall" variant="transparent" className="group">
              <TriangleRightMini className="text-ui-fg-muted transition-transform group-data-[state='open']:rotate-90" />
            </IconButton>
          </Collapsible.Trigger>
          <div className="flex items-center gap-x-1.5">
            <Text size="small" weight="plus" leading="compact">
              {taxRate.name}
            </Text>
            {taxRate.code && (
              <div className="text-ui-fg-subtle flex items-center gap-x-1.5">
                <Text size="small" leading="compact">
                  ·
                </Text>
                <Text size="small" leading="compact">
                  {taxRate.code}
                </Text>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("taxRegions.fields.targets.numberOfTargets", {
              count: numberOfTargets,
            })}
          </Text>
          <div className="bg-ui-border-base h-3 w-px" />
          <StatusBadge color={taxRate.is_combinable ? "green" : "grey"}>
            {taxRate.is_combinable
              ? t("taxRegions.fields.isCombinable.true")
              : t("taxRegions.fields.isCombinable.false")}
          </StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    to: `overrides/${taxRate.id}/edit`,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <Collapsible.Content>
        <div className="bg-ui-bg-subtle">
          <Divider variant="dashed" />
          <div className="px-6 py-3">
            <div className="flex items-center gap-x-3">
              <div className="text-ui-fg-muted flex size-5 items-center justify-center">
                <ArrowDownRightMini />
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                <Badge size="2xsmall">{formatPercentage(taxRate.rate)}</Badge>
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {t("taxRegions.fields.targets.operators.on")}
                </Text>
                {Object.entries(groupedRules).map(([reference, ids], index) => {
                  return (
                    <div
                      key={reference}
                      className="flex items-center gap-x-1.5"
                    >
                      <Reference
                        key={reference}
                        reference={reference as TaxRateRuleReferenceType}
                        ids={ids}
                      />
                      {index < Object.keys(groupedRules).length - 1 && (
                        <Text
                          size="small"
                          leading="compact"
                          className="text-ui-fg-subtle"
                        >
                          {t("taxRegions.fields.targets.operators.and")}
                        </Text>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

const Reference = ({
  reference,
  ids,
}: {
  reference: TaxRateRuleReferenceType
  ids: string[]
}) => {
  return (
    <div className="flex items-center gap-x-1.5">
      <ReferenceBadge reference={reference} />
      <ReferenceValues type={reference} ids={ids} />
    </div>
  )
}

const ReferenceBadge = ({
  reference,
}: {
  reference: TaxRateRuleReferenceType
}) => {
  const { t } = useTranslation()
  let label: string | null = null

  switch (reference) {
    case TaxRateRuleReferenceType.PRODUCT:
      label = t("taxRegions.fields.targets.tags.product")
      break
    case TaxRateRuleReferenceType.PRODUCT_COLLECTION:
      label = t("taxRegions.fields.targets.tags.productCollection")
      break
    case TaxRateRuleReferenceType.PRODUCT_TAG:
      label = t("taxRegions.fields.targets.tags.productTag")
      break
    case TaxRateRuleReferenceType.PRODUCT_TYPE:
      label = t("taxRegions.fields.targets.tags.productType")
      break
    case TaxRateRuleReferenceType.CUSTOMER_GROUP:
      label = t("taxRegions.fields.targets.tags.customerGroup")
      break
  }

  if (!label) {
    return null
  }

  return <Badge size="2xsmall">{label}</Badge>
}

const ReferenceValues = ({
  type,
  ids,
}: {
  type: TaxRateRuleReferenceType
  ids: string[]
}) => {
  const { t } = useTranslation()

  const { isPending, additional, labels, isError, error } = useReferenceValues(
    type,
    ids
  )

  if (isError) {
    throw error
  }

  if (isPending) {
    return (
      <div className="bg-ui-tag-neutral-bg border-ui-tag-neutral-border h-5 w-14 animate-pulse rounded-md" />
    )
  }

  return (
    <Tooltip
      content={
        <ul>
          {labels?.map((label: string, index) => (
            <li key={index}>{label}</li>
          ))}
          {additional > 0 && (
            <li>
              {t("taxRegions.fields.targets.additionalValues", {
                count: additional,
              })}
            </li>
          )}
        </ul>
      }
    >
      <Badge size="2xsmall">
        {t("taxRegions.fields.targets.values", {
          count: ids.length,
        })}
      </Badge>
    </Tooltip>
  )
}

const useReferenceValues = (
  type: TaxRateRuleReferenceType,
  ids: string[]
): {
  labels: string[] | undefined
  isPending: boolean
  additional: number
  isError: boolean
  error: FetchError | null
} => {
  const products = useProducts(
    {
      id: ids,
      limit: 10,
    },
    {
      enabled: !!ids.length && type === TaxRateRuleReferenceType.PRODUCT,
    }
  )

  const tags = useProductTags(
    {
      id: ids,
      limit: 10,
    },
    {
      enabled: !!ids.length && type === TaxRateRuleReferenceType.PRODUCT_TAG,
    }
  )

  const productTypes = useProductTypes(
    {
      id: ids,
      limit: 10,
    },
    {
      enabled: !!ids.length && type === TaxRateRuleReferenceType.PRODUCT_TYPE,
    }
  )

  const collections = useCollections(
    {
      id: ids,
      limit: 10,
    },
    {
      enabled:
        !!ids.length && type === TaxRateRuleReferenceType.PRODUCT_COLLECTION,
    }
  )

  const customerGroups = useCustomerGroups(
    {
      id: ids,
      limit: 10,
    },
    {
      enabled: !!ids.length && type === TaxRateRuleReferenceType.CUSTOMER_GROUP,
    }
  )

  switch (type) {
    case TaxRateRuleReferenceType.PRODUCT:
      return {
        labels: products.products?.map((product) => product.title),
        isPending: products.isPending,
        additional:
          products.products && products.count
            ? products.count - products.products.length
            : 0,
        isError: products.isError,
        error: products.error,
      }
    case TaxRateRuleReferenceType.PRODUCT_TAG:
      return {
        labels: tags.product_tags?.map((tag: any) => tag.value),
        isPending: tags.isPending,
        additional:
          tags.product_tags && tags.count
            ? tags.count - tags.product_tags.length
            : 0,
        isError: tags.isError,
        error: tags.error,
      }
    case TaxRateRuleReferenceType.PRODUCT_TYPE:
      return {
        labels: productTypes.product_types?.map((type) => type.value),
        isPending: productTypes.isPending,
        additional:
          productTypes.product_types && productTypes.count
            ? productTypes.count - productTypes.product_types.length
            : 0,
        isError: productTypes.isError,
        error: productTypes.error,
      }
    case TaxRateRuleReferenceType.PRODUCT_COLLECTION:
      return {
        labels: collections.collections?.map((collection) => collection.title!),
        isPending: collections.isPending,
        additional:
          collections.collections && collections.count
            ? collections.count - collections.collections.length
            : 0,
        isError: collections.isError,
        error: collections.error,
      }
    case TaxRateRuleReferenceType.CUSTOMER_GROUP:
      return {
        labels: customerGroups.customer_groups?.map((group) => group.name!),
        isPending: customerGroups.isPending,
        additional:
          customerGroups.customer_groups && customerGroups.count
            ? customerGroups.count - customerGroups.customer_groups.length
            : 0,
        isError: customerGroups.isError,
        error: customerGroups.error,
      }
  }
}
