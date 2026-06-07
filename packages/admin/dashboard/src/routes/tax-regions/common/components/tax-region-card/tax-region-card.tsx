import { HttpTypes } from "@medusajs/types"
import { Heading, Text, Tooltip, clx } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"

import {
  ExclamationCircle,
  MapPin,
  Plus,
  Trash,
  PencilSquare,
} from "@medusajs/icons"
import { ComponentPropsWithoutRef, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  Action,
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { getCountryByIso2 } from "../../../../../lib/data/countries"
import {
  getProvinceByIso2,
  isProvinceInCountry,
} from "../../../../../lib/data/country-states"
import {
  useTaxRatePermissions,
  useTaxRegionPermissions,
} from "../../../../../hooks/use-resource-permissions"
import { useDeleteTaxRegionAction } from "../../hooks"

interface TaxRegionCardProps extends ComponentPropsWithoutRef<"div"> {
  taxRegion: HttpTypes.AdminTaxRegion
  type?: "header" | "list"
  variant?: "country" | "province"
  asLink?: boolean
  badge?: ReactNode
}

export const TaxRegionCard = ({
  taxRegion,
  type = "list",
  variant = "country",
  asLink = true,
  badge,
}: TaxRegionCardProps) => {
  const { t } = useTranslation()
  const { canCreate: canCreateTaxRates } = useTaxRatePermissions()

  const { id, country_code, province_code } = taxRegion

  const country = getCountryByIso2(country_code)
  const province = getProvinceByIso2(province_code)

  let name = "N/A"
  let misconfiguredSublevelTooltip: string | null = null

  if (province || province_code) {
    name = province ? province : province_code!.toUpperCase()
  } else if (country || country_code) {
    name = country ? country.display_name : country_code!.toUpperCase()
  }

  if (
    country_code &&
    province_code &&
    !isProvinceInCountry(country_code, province_code)
  ) {
    name = province_code.toUpperCase()
    misconfiguredSublevelTooltip = t(
      "taxRegions.fields.sublevels.tooltips.notPartOfCountry",
      {
        country: country?.display_name,
        province: province_code.toUpperCase(),
      }
    )
  }

  const showCreateDefaultTaxRate =
    !taxRegion.tax_rates.filter((tr) => tr.is_default).length &&
    type === "header" &&
    canCreateTaxRates

  const Component = (
    <div
      className={clx(
        "group-data-[link=true]:hover:bg-ui-bg-base-hover transition-fg flex flex-col justify-between gap-y-4 px-6 md:flex-row md:items-center md:gap-y-0",
        {
          "py-4": type === "header",
          "py-3": type === "list",
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <IconAvatar size={type === "list" ? "small" : "large"}>
            {country_code && !province_code ? (
              <div
                className={clx(
                  "flex size-fit items-center justify-center overflow-hidden rounded-[1px]",
                  {
                    "rounded-sm": type === "header",
                  }
                )}
              >
                <ReactCountryFlag
                  countryCode={country_code}
                  svg
                  style={
                    type === "list"
                      ? { width: "12px", height: "9px" }
                      : { width: "16px", height: "12px" }
                  }
                  aria-label={country?.display_name}
                />
              </div>
            ) : (
              <MapPin className="text-ui-fg-subtle" />
            )}
          </IconAvatar>
          <div>
            {type === "list" ? (
              <Text size="small" weight="plus" leading="compact">
                {name}
              </Text>
            ) : (
              <div className="flex items-center gap-x-2">
                <Heading>{name}</Heading>
              </div>
            )}
          </div>
        </div>
        <div className="flex size-fit items-center gap-x-2 md:hidden">
          {misconfiguredSublevelTooltip && (
            <Tooltip content={misconfiguredSublevelTooltip}>
              <ExclamationCircle className="text-ui-tag-orange-icon" />
            </Tooltip>
          )}
          {badge}
          <TaxRegionCardActions
            taxRegion={taxRegion}
            showCreateDefaultTaxRate={showCreateDefaultTaxRate}
          />
        </div>
      </div>

      <div className="hidden size-fit items-center gap-x-2 md:flex">
        {misconfiguredSublevelTooltip && (
          <Tooltip content={misconfiguredSublevelTooltip}>
            <ExclamationCircle className="text-ui-tag-orange-icon" />
          </Tooltip>
        )}
        {badge}
        <TaxRegionCardActions
          taxRegion={taxRegion}
          showCreateDefaultTaxRate={showCreateDefaultTaxRate}
        />
      </div>
    </div>
  )

  if (asLink) {
    return (
      <Link
        to={variant === "country" ? `${id}` : `provinces/${id}`}
        data-link="true"
        className="group block"
      >
        {Component}
      </Link>
    )
  }

  return Component
}

const TaxRegionCardActions = ({
  taxRegion,
  showCreateDefaultTaxRate,
}: {
  taxRegion: HttpTypes.AdminTaxRegion
  showCreateDefaultTaxRate?: boolean
}) => {
  const { t } = useTranslation()
  const { canUpdate, canDelete } = useTaxRegionPermissions()

  const hasParent = !!taxRegion.parent_id

  const to = hasParent
    ? `/settings/tax-regions/${taxRegion.parent_id}`
    : undefined
  const handleDelete = useDeleteTaxRegionAction({ taxRegion, to })

  const groups: ActionGroup[] = []

  if (canUpdate && showCreateDefaultTaxRate) {
    groups.push({
      actions: [
        {
          icon: <Plus />,
          label: t("taxRegions.fields.defaultTaxRate.action"),
          to: `tax-rates/create`,
        },
      ],
    })
  }

  const mutationActions = [
    canUpdate && !hasParent
      ? {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `/settings/tax-regions/${taxRegion.id}/edit`,
        }
      : null,
    canDelete
      ? {
          icon: <Trash />,
          label: t("actions.delete"),
          onClick: handleDelete,
        }
      : null,
  ].filter(Boolean) as unknown as Action[]

  if (mutationActions.length) {
    groups.push({ actions: mutationActions })
  }

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}
