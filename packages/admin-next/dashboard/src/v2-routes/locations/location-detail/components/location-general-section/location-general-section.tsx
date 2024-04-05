import { PencilSquare } from "@medusajs/icons"
import type { StockLocationAddressDTO } from "@medusajs/types"
import { Container, Heading, Text, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { ExtendedStockLocationDTO } from "../../../../../types/api-responses"

type LocationGeneralSectionProps = {
  location: ExtendedStockLocationDTO
}

export const LocationGeneralSection = ({
  location,
}: LocationGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{location.name}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `edit`,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.address")}
        </Text>
        <AddressDisplay address={location.address} />
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text
          size="small"
          weight="plus"
          leading="compact"
          className={clx({
            "text-ui-fg-subtle": !location.address?.company,
          })}
        >
          {t("fields.company")}
        </Text>
        <Text
          size="small"
          leading="compact"
          className={clx({
            "text-ui-fg-subtle": !location.address?.company,
          })}
        >
          {location.address?.company || "-"}
        </Text>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.phone")}
        </Text>
        <Text
          size="small"
          leading="compact"
          className={clx({
            "text-ui-fg-subtle": !location.address?.phone,
          })}
        >
          {location.address?.phone || "-"}
        </Text>
      </div>
    </Container>
  )
}

const AddressDisplay = ({
  address,
}: {
  address: StockLocationAddressDTO | undefined
}) => {
  if (!address) {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        -
      </Text>
    )
  }

  const { address_1, address_2, city, province, postal_code, country_code } =
    address

  const addressParts = [
    address_1,
    address_2,
    `${city ? city + " " : ""}${province ? province + " " : ""}${postal_code}`,
    country_code.toUpperCase(),
  ]

  const addressString = addressParts
    .filter((part) => part !== null && part !== undefined && part.trim() !== "")
    .join(", ")

  return <Text size="small">{addressString}</Text>
}
