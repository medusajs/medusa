import { HttpTypes } from "@medusajs/types"
import { Heading, Text, clx } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"

import { Map, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { getCountryByIso2 } from "../../../../../lib/data/countries"
import { useDeleteTaxRegionAction } from "../../hooks"

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
  const { id, country_code, province_code } = taxRegion

  const country = getCountryByIso2(country_code)
  const name =
    country?.display_name ||
    country_code?.toUpperCase() ||
    province_code?.toUpperCase() ||
    "N/A"

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
            ) : (
              <Map className="text-ui-fg-subtle" />
            )}
          </IconAvatar>
          <div>
            {type === "list" ? (
              <Text size="small" weight="plus" leading="compact">
                {country?.display_name}
              </Text>
            ) : (
              <Heading>{country?.display_name}</Heading>
            )}
          </div>
        </div>
        <div className="block size-fit md:hidden">
          <TaxRegionCardActions taxRegion={taxRegion} name={name} />
        </div>
      </div>

      <div className="hidden size-fit md:block">
        <TaxRegionCardActions taxRegion={taxRegion} name={name} />
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

const TaxRegionCardActions = ({
  taxRegion,
}: TaxRegionCardProps & { name: string }) => {
  const { t } = useTranslation()

  const to = taxRegion.parent_id
    ? `/settings/taxes/${taxRegion.parent_id}`
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
