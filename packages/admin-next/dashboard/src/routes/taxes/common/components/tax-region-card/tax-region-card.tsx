import { HttpTypes } from "@medusajs/types"
import { Badge, Heading, Text, clx } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"

import { PencilSquare, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { getCountryByIso2 } from "../../../../../lib/data/countries"
import { formatPercentage } from "../../../../../lib/percentage-helpers"

type TaxRegionCardProps = {
  taxRegion: HttpTypes.AdminTaxRegion
  type?: "header" | "list"
  asLink?: boolean
}

export const TaxRegionCard = ({
  taxRegion,
  type = "list",
  asLink = true,
}: TaxRegionCardProps) => {
  const { t } = useTranslation()
  const { id, country_code, name, rate, tax_rates } = taxRegion

  const country = getCountryByIso2(country_code)

  const defaultTaxRates = tax_rates.filter((tr) => tr.is_default)
  const overrideTaxRates = tax_rates.filter((tr) => !tr.is_default)

  const Component = (
    <div className="flex flex-col justify-between gap-y-4 px-6 py-4 md:flex-row md:items-center md:gap-y-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <IconAvatar size={type === "list" ? "small" : "large"}>
            {country_code ? (
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
            ) : null}
          </IconAvatar>
          <div>
            {type === "list" ? (
              <Text size="small" weight="plus" leading="compact">
                {country?.display_name}
              </Text>
            ) : (
              <Heading>{country?.display_name}</Heading>
            )}
            <div className="text-ui-fg-subtle flex items-center gap-x-2">
              <Text size="small">{country_code?.toUpperCase()}</Text>
              <Text size="small">·</Text>
              <Text size="small">
                {t("taxRegions.fields.taxRatesCount", {
                  count: defaultTaxRates.length,
                })}
              </Text>
              <Text size="small">·</Text>
              <Text size="small">
                {t("taxRegions.fields.taxOverridesCount", {
                  count: overrideTaxRates.length,
                })}
              </Text>
            </div>
          </div>
        </div>
        <div className="block size-fit md:hidden">
          <TaxRegionCardActions taxRegion={taxRegion} />
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-1.5">
          {name && <Badge size="2xsmall">{name}</Badge>}
          <Badge size="2xsmall">{formatPercentage(rate)}</Badge>
        </div>
        <div className="hidden size-fit md:block">
          <TaxRegionCardActions taxRegion={taxRegion} />
        </div>
      </div>
    </div>
  )

  if (asLink) {
    return (
      <Link to={`/settings/taxes/${id}`} className="block">
        {Component}
      </Link>
    )
  }

  return Component
}

const TaxRegionCardActions = ({ taxRegion }: TaxRegionCardProps) => {
  const { t } = useTranslation()

  const handleDelete = () => {}

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/taxes/${taxRegion.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const TaxRegionCardSkeleton = () => {}
