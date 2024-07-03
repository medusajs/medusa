import { HttpTypes } from "@medusajs/types"
import { Heading, Text, clx } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"

import { MapPin, Trash } from "@medusajs/icons"
import { ComponentPropsWithoutRef } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { getCountryByIso2 } from "../../../../../lib/data/countries"
import { getProvinceByIso2 } from "../../../../../lib/data/country-states"
import { useDeleteTaxRegionAction } from "../../hooks"

interface TaxRegionCardProps extends ComponentPropsWithoutRef<"div"> {
  taxRegion: HttpTypes.AdminTaxRegion
  type?: "header" | "list"
  variant?: "country" | "province"
  asLink?: boolean
}

export const TaxRegionCard = ({
  taxRegion,
  type = "list",
  variant = "country",
  asLink = true,
}: TaxRegionCardProps) => {
  const { id, country_code, province_code } = taxRegion

  const country = getCountryByIso2(country_code)
  const province = getProvinceByIso2(province_code)

  let name = "N/A"

  if (province || province_code) {
    name = province ? province : province_code!.toUpperCase()
  } else if (country || country_code) {
    name = country ? country.display_name : country_code!.toUpperCase()
  }

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
              <Heading>{name}</Heading>
            )}
          </div>
        </div>
        <div className="block size-fit md:hidden">
          <TaxRegionCardActions taxRegion={taxRegion} />
        </div>
      </div>

      <div className="hidden size-fit md:block">
        <TaxRegionCardActions taxRegion={taxRegion} />
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

const TaxRegionCardActions = ({ taxRegion }: TaxRegionCardProps) => {
  const { t } = useTranslation()

  const to = taxRegion.parent_id
    ? `/settings/tax-regions/${taxRegion.parent_id}`
    : undefined
  const handleDelete = useDeleteTaxRegionAction({ taxRegion, to })

  return (
    <ActionMenu
      groups={[
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
