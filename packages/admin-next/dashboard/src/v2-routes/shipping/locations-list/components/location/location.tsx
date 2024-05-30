import { Button, Container, Text } from "@medusajs/ui"
import {
  FulfillmentSetDTO,
  ServiceZoneDTO,
  ShippingOptionDTO,
  StockLocationDTO,
} from "@medusajs/types"
import { useTranslation } from "react-i18next"
import {
  Buildings,
  ChevronDown,
  CurrencyDollar,
  Map,
  PencilSquare,
  Plus,
  Trash,
} from "@medusajs/icons"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { countries } from "../../../../../lib/countries"
import {
  useCreateFulfillmentSet,
  useDeleteFulfillmentSet,
  useDeleteServiceZone,
} from "../../../../../hooks/api/stock-locations"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { formatProvider } from "../../../../../lib/format-provider"
import { useDeleteShippingOption } from "../../../../../hooks/api/shipping-options.ts"

type ShippingOptionProps = {
  option: ShippingOptionDTO
}

function ShippingOption({ option }: ShippingOptionProps) {
  const { t } = useTranslation()

  const { mutateAsync: deleteOption } = useDeleteShippingOption(option.id)

  const handleDelete = async () => {
    await deleteOption()
  }

  return (
    <div className="shadow-elevation-card-rest flex items-center justify-between rounded-md px-4 py-3">
      <div className="flex-1">
        <span className="txt-small font-medium">
          {option.name} - {option.shipping_profile.name} (
          {formatProvider(option.provider_id)})
        </span>
      </div>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("shipping.serviceZone.editOption"),
                icon: <PencilSquare />,
                disabled: true,
              },
              {
                label: t("shipping.serviceZone.editPrices"),
                icon: <CurrencyDollar />,
                disabled: true,
              },
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
  )
}

type ServiceZoneOptionsProps = {
  zone: ServiceZoneDTO
  locationId: string
  fulfillmentSetId: string
}

function ServiceZoneOptions({
  zone,
  locationId,
  fulfillmentSetId,
}: ServiceZoneOptionsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const shippingOptions = zone.shipping_options

  return (
    <>
      <div className="flex flex-col py-4">
        <Text
          size="small"
          weight="plus"
          className="text-ui-fg-subtle mb-4"
          as="div"
        >
          {t("shipping.serviceZone.shippingOptions")}
        </Text>
        {!shippingOptions.length && (
          <div className="text-ui-fg-muted txt-medium flex h-[120px] flex-col items-center justify-center gap-y-4">
            <div>{t("shipping.serviceZone.shippingOptionsPlaceholder")}</div>
            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  `/shipping/location/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/shipping-options/create`
                )
              }
            >
              {t("shipping.serviceZone.addShippingOptions")}
            </Button>
          </div>
        )}

        {!!shippingOptions.length && (
          <div className="flex flex-col gap-3">
            {shippingOptions.map((o) => (
              <ShippingOption key={o.id} option={o} />
            ))}
          </div>
        )}
      </div>
      {/*TODO implement return options*/}
      {/*<div className="py-4">*/}
      {/*  <Text*/}
      {/*    size="small"*/}
      {/*    weight="plus"*/}
      {/*    className="text-ui-fg-subtle mb-4"*/}
      {/*    as="div"*/}
      {/*  >*/}
      {/*    {t("shipping.serviceZone.returnOptions")}*/}
      {/*  </Text>*/}
      {/*</div>*/}
    </>
  )
}

type ServiceZoneProps = {
  zone: ServiceZoneDTO
  locationId: string
  fulfillmentSetId: string
}

function ServiceZone({ zone, locationId, fulfillmentSetId }: ServiceZoneProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const { mutateAsync: deleteZone } = useDeleteServiceZone(
    fulfillmentSetId,
    zone.id
  )

  const handleDelete = async () => {
    await deleteZone()
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-x-4">
        {/*ICON*/}
        <div className="grow-0 rounded-lg border">
          <div className="bg-ui-bg-field m-1 rounded-md p-2">
            <Map className="text-ui-fg-subtle" />
          </div>
        </div>

        {/*INFO*/}
        <div className="grow-1 flex flex-1 flex-col">
          <Text weight="plus">{zone.name}</Text>
          <Text className="text-ui-fg-subtle txt-small">
            {zone.shipping_options.length}{" "}
            {t("shipping.serviceZone.optionsLength", {
              count: zone.shipping_options.length,
            })}
          </Text>
        </div>

        {/*ACTION*/}
        <div className="itemx-center -m-2 flex grow-0 gap-2">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("shipping.serviceZone.addShippingOptions"),
                    icon: <Plus />,
                    to: `/shipping/location/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/shipping-options/create`,
                  },
                  {
                    label: t("actions.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
          <Button
            onClick={() => setOpen((s) => !s)}
            className="flex items-center justify-center"
            variant="transparent"
          >
            <ChevronDown
              style={{
                transform: `rotate(${!open ? 0 : 180}deg)`,
                transition: ".2s transform ease-in-out",
              }}
            />
          </Button>
        </div>
      </div>
      {open && (
        <div>
          <ServiceZoneOptions
            fulfillmentSetId={fulfillmentSetId}
            locationId={locationId}
            zone={zone}
          />
        </div>
      )}
    </>
  )
}

enum FulfillmentSetType {
  Delivery = "delivery",
  Pickup = "pickup",
}

type FulfillmentSetProps = {
  fulfillmentSet?: FulfillmentSetDTO
  locationName: string
  locationId: string
  type: FulfillmentSetType
}

function FulfillmentSet(props: FulfillmentSetProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { fulfillmentSet, locationName, locationId, type } = props

  const fulfillmentSetExists = !!fulfillmentSet
  const hasServiceZones = !!fulfillmentSet?.service_zones?.length

  const { mutateAsync: createFulfillmentSet, isPending: isLoading } =
    useCreateFulfillmentSet(locationId)

  const { mutateAsync: deleteFulfillmentSet } = useDeleteFulfillmentSet(
    fulfillmentSet?.id
  )

  const handleCreate = async () => {
    await createFulfillmentSet({
      name: `${locationName} ${type}`,
      type: type,
    })
  }

  const handleDelete = async () => {
    await deleteFulfillmentSet()
  }

  return (
    <div className="flex flex-col px-6 py-5">
      <div className="flex items-center justify-between">
        <Text size="small" weight="plus" className="text-ui-fg-subtle" as="div">
          {t(`shipping.fulfillmentSet.${type}.title`)}
        </Text>
        {!fulfillmentSetExists ? (
          <Button onClick={handleCreate} variant="secondary">
            {t(`shipping.fulfillmentSet.${type}.enable`)}
          </Button>
        ) : (
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("shipping.fulfillmentSet.addZone"),
                    icon: <Map />,
                    to: `/shipping/location/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`,
                  },
                  {
                    label: t("shipping.fulfillmentSet.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
        )}
      </div>

      {fulfillmentSetExists && !hasServiceZones && (
        <div className="text-ui-fg-muted txt-medium flex h-[120px] flex-col items-center justify-center gap-y-4">
          <div>{t("shipping.fulfillmentSet.placeholder")}</div>
          <Button
            variant="secondary"
            onClick={() =>
              navigate(
                `/shipping/location/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`
              )
            }
          >
            {t("shipping.fulfillmentSet.addZone")}
          </Button>
        </div>
      )}

      {hasServiceZones && (
        <div className="mt-4 flex flex-col gap-6">
          {fulfillmentSet?.service_zones.map((zone) => (
            <ServiceZone
              key={zone.id}
              zone={zone}
              locationId={locationId}
              fulfillmentSetId={fulfillmentSet.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type LocationProps = {
  location: StockLocationDTO
}

function Location(props: LocationProps) {
  const { location } = props
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col divide-y p-0">
      <div className="px-6 py-5">
        <div className="flex flex-row items-center justify-between gap-x-4">
          {/*ICON*/}
          <div className="grow-0 rounded-lg border">
            <div className="bg-ui-bg-field m-1 rounded-md p-2">
              <Buildings className="text-ui-fg-subtle" />
            </div>
          </div>

          {/*LOCATION INFO*/}
          <div className="grow-1 flex flex-1 flex-col">
            <Text weight="plus">{location.name}</Text>
            <Text className="text-ui-fg-subtle txt-small">
              {location.address?.city},{" "}
              {
                countries.find(
                  (c) =>
                    location.address?.country_code.toLowerCase() === c.iso_2
                )?.display_name
              }
            </Text>
          </div>

          {/*ACTION*/}
          <div className="flex grow-0 gap-2">{/*// TODO*/}</div>
        </div>
      </div>

      <FulfillmentSet
        locationId={location.id}
        locationName={location.name}
        type={FulfillmentSetType.Pickup}
        fulfillmentSet={location.fulfillment_sets.find(
          (f) => f.type === FulfillmentSetType.Pickup
        )}
      />
      <FulfillmentSet
        locationId={location.id}
        locationName={location.name}
        type={FulfillmentSetType.Delivery}
        fulfillmentSet={location.fulfillment_sets.find(
          (f) => f.type === FulfillmentSetType.Delivery
        )}
      />
    </Container>
  )
}

export default Location
