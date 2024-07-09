import {
  ArchiveBox,
  CurrencyDollar,
  Map,
  PencilSquare,
  Plus,
  Trash,
  TriangleDownMini,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Badge,
  Container,
  Heading,
  IconButton,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { Divider } from "../../../../../components/common/divider"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { LinkButton } from "../../../../../components/common/link-button"
import { ListSummary } from "../../../../../components/common/list-summary"
import {
  useDeleteFulfillmentServiceZone,
  useDeleteFulfillmentSet,
} from "../../../../../hooks/api/fulfillment-sets"
import { useDeleteShippingOption } from "../../../../../hooks/api/shipping-options"
import {
  useCreateStockLocationFulfillmentSet,
  useDeleteStockLocation,
} from "../../../../../hooks/api/stock-locations"
import { getFormattedAddress } from "../../../../../lib/addresses"
import {
  StaticCountry,
  countries as staticCountries,
} from "../../../../../lib/countries"
import { formatProvider } from "../../../../../lib/format-provider"
import {
  isOptionEnabledInStore,
  isReturnOption,
} from "../../../../../lib/shipping-options"
import { FulfillmentSetType } from "../../../common/constants"

type LocationGeneralSectionProps = {
  location: HttpTypes.AdminStockLocation
}

export const LocationGeneralSection = ({
  location,
}: LocationGeneralSectionProps) => {
  return (
    <>
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading>{location.name}</Heading>
            <Text className="text-ui-fg-subtle txt-small">
              {getFormattedAddress({ address: location.address }).join(", ")}
            </Text>
          </div>
          <Actions location={location} />
        </div>
      </Container>

      <FulfillmentSet
        locationId={location.id}
        locationName={location.name}
        type={FulfillmentSetType.Pickup}
        fulfillmentSet={location.fulfillment_sets?.find(
          (f) => f.type === FulfillmentSetType.Pickup
        )}
      />

      <FulfillmentSet
        locationId={location.id}
        locationName={location.name}
        type={FulfillmentSetType.Shipping}
        fulfillmentSet={location.fulfillment_sets?.find(
          (f) => f.type === FulfillmentSetType.Shipping
        )}
      />
    </>
  )
}

type ShippingOptionProps = {
  option: HttpTypes.AdminShippingOption
  fulfillmentSetId: string
  locationId: string
}

function ShippingOption({
  option,
  fulfillmentSetId,
  locationId,
}: ShippingOptionProps) {
  const prompt = usePrompt()
  const { t } = useTranslation()

  const isStoreOption = isOptionEnabledInStore(option)

  const { mutateAsync } = useDeleteShippingOption(option.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("stockLocations.shippingOptions.delete.confirmation", {
        name: option.name,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: option.name,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(
          t("stockLocations.shippingOptions.delete.successToast", {
            name: option.name,
          })
        )
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex-1">
        <Text size="small" weight="plus">
          {option.name} - {option.shipping_profile.name} (
          {formatProvider(option.provider_id)})
        </Text>
      </div>
      <Badge
        className="mr-4"
        color={isStoreOption ? "grey" : "purple"}
        size="2xsmall"
        rounded="full"
      >
        {isStoreOption ? t("general.store") : t("general.admin")}
      </Badge>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <PencilSquare />,
                label: t("stockLocations.shippingOptions.edit.action"),
                to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${option.service_zone_id}/shipping-option/${option.id}/edit`,
              },
              {
                label: t("stockLocations.shippingOptions.pricing.action"),
                icon: <CurrencyDollar />,
                to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${option.service_zone_id}/shipping-option/${option.id}/pricing`,
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
  )
}

type ServiceZoneOptionsProps = {
  zone: HttpTypes.AdminServiceZone
  locationId: string
  fulfillmentSetId: string
}

function ServiceZoneOptions({
  zone,
  locationId,
  fulfillmentSetId,
}: ServiceZoneOptionsProps) {
  const { t } = useTranslation()

  const shippingOptions = zone.shipping_options.filter(
    (o) => !isReturnOption(o)
  )

  const returnOptions = zone.shipping_options.filter((o) => isReturnOption(o))

  return (
    <div>
      <Divider variant="dashed" />
      <div className="flex flex-col gap-y-4 px-6 py-4">
        <div className="item-center flex justify-between">
          <span className="text-ui-fg-subtle txt-small self-center font-medium">
            {t("stockLocations.shippingOptions.create.shipping.label")}
          </span>
          <LinkButton
            to={`/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/shipping-option/create`}
          >
            {t("stockLocations.shippingOptions.create.action")}
          </LinkButton>
        </div>

        {!!shippingOptions.length && (
          <div className="shadow-elevation-card-rest bg-ui-bg-subtle grid divide-y rounded-md">
            {shippingOptions.map((o) => (
              <ShippingOption
                key={o.id}
                option={o}
                locationId={locationId}
                fulfillmentSetId={fulfillmentSetId}
              />
            ))}
          </div>
        )}
      </div>

      <Divider variant="dashed" />

      <div className="flex flex-col gap-y-4 px-6 py-4">
        <div className="item-center flex justify-between">
          <span className="text-ui-fg-subtle txt-small self-center font-medium">
            {t("stockLocations.shippingOptions.create.returns.label")}
          </span>
          <LinkButton
            to={`/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/shipping-option/create?is_return`}
          >
            {t("stockLocations.shippingOptions.create.action")}
          </LinkButton>
        </div>

        {!!returnOptions.length && (
          <div className="shadow-elevation-card-rest bg-ui-bg-subtle grid divide-y rounded-md">
            {returnOptions.map((o) => (
              <ShippingOption
                key={o.id}
                option={o}
                locationId={locationId}
                fulfillmentSetId={fulfillmentSetId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type ServiceZoneProps = {
  zone: HttpTypes.AdminServiceZone
  locationId: string
  fulfillmentSetId: string
}

function ServiceZone({ zone, locationId, fulfillmentSetId }: ServiceZoneProps) {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const [open, setOpen] = useState(true)

  const { mutateAsync: deleteZone } = useDeleteFulfillmentServiceZone(
    fulfillmentSetId,
    zone.id
  )

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("stockLocations.serviceZones.delete.confirmation", {
        name: zone.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await deleteZone(undefined, {
      onError: (e) => {
        toast.error(e.message)
      },
      onSuccess: () => {
        toast.success(
          t("stockLocations.serviceZones.delete.successToast", {
            name: zone.name,
          })
        )
      },
    })
  }

  const countries = useMemo(() => {
    const countryGeoZones = zone.geo_zones.filter((g) => g.type === "country")

    const countries = countryGeoZones
      .map(({ country_code }) =>
        staticCountries.find((c) => c.iso_2 === country_code)
      )
      .filter((c) => !!c) as StaticCountry[]

    if (
      process.env.NODE_ENV === "development" &&
      countryGeoZones.length !== countries.length
    ) {
      console.warn(
        "Some countries are missing in the static countries list",
        countryGeoZones
          .filter((g) => !countries.find((c) => c.iso_2 === g.country_code))
          .map((g) => g.country_code)
      )
    }

    return countries.sort((c1, c2) => c1.name.localeCompare(c2.name))
  }, [zone.geo_zones])

  const [shippingOptionsCount, returnOptionsCount] = useMemo(() => {
    const options = zone.shipping_options

    const optionsCount = options.filter((o) => !isReturnOption(o)).length

    const returnOptionsCount = options.filter(isReturnOption).length

    return [optionsCount, returnOptionsCount]
  }, [zone.shipping_options])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between gap-x-4 px-6 py-4">
        <IconAvatar>
          <Map />
        </IconAvatar>

        <div className="grow-1 flex flex-1 flex-col">
          <Text size="small" leading="compact" weight="plus">
            {zone.name}
          </Text>
          <div className="flex items-center gap-2">
            <ListSummary
              variant="base"
              list={countries.map((c) => c.display_name)}
              inline
              n={1}
            />
            <span>·</span>
            <Text className="text-ui-fg-subtle txt-small">
              {t("stockLocations.shippingOptions.fields.count.shipping", {
                count: shippingOptionsCount,
              })}
            </Text>
            <span>·</span>
            <Text className="text-ui-fg-subtle txt-small">
              {t("stockLocations.shippingOptions.fields.count.returns", {
                count: returnOptionsCount,
              })}
            </Text>
          </div>
        </div>

        <div className="flex grow-0 items-center gap-4">
          <IconButton
            size="small"
            onClick={() => setOpen((s) => !s)}
            variant="transparent"
          >
            <TriangleDownMini
              style={{
                transform: `rotate(${!open ? 0 : 180}deg)`,
                transition: ".2s transform ease-in-out",
              }}
            />
          </IconButton>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/edit`,
                  },
                  {
                    label: t("stockLocations.serviceZones.manageAreas.action"),
                    icon: <Map />,
                    to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/areas`,
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
      {open && (
        <ServiceZoneOptions
          fulfillmentSetId={fulfillmentSetId}
          locationId={locationId}
          zone={zone}
        />
      )}
    </div>
  )
}

type FulfillmentSetProps = {
  fulfillmentSet?: HttpTypes.AdminFulfillmentSet
  locationName: string
  locationId: string
  type: FulfillmentSetType
}

function FulfillmentSet(props: FulfillmentSetProps) {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { fulfillmentSet, locationName, locationId, type } = props

  const fulfillmentSetExists = !!fulfillmentSet

  const hasServiceZones = !!fulfillmentSet?.service_zones.length

  const { mutateAsync: createFulfillmentSet } =
    useCreateStockLocationFulfillmentSet(locationId)

  const { mutateAsync: deleteFulfillmentSet } = useDeleteFulfillmentSet(
    fulfillmentSet?.id!
  )

  const handleCreate = async () => {
    await createFulfillmentSet(
      {
        name: `${locationName} ${
          type === FulfillmentSetType.Pickup ? "pick up" : type
        }`,
        type,
      },
      {
        onSuccess: () => {
          toast.success(t(`stockLocations.fulfillmentSets.enable.${type}`))
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  }

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t(`stockLocations.fulfillmentSets.disable.confirmation`, {
        name: fulfillmentSet?.name,
      }),
      confirmText: t("actions.disable"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await deleteFulfillmentSet(undefined, {
      onSuccess: () => {
        toast.success(t(`stockLocations.fulfillmentSets.disable.${type}`))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  const groups = fulfillmentSet
    ? [
        {
          actions: [
            {
              icon: <Plus />,
              label: t("stockLocations.serviceZones.create.action"),
              to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.disable"),
              onClick: handleDelete,
            },
          ],
        },
      ]
    : [
        {
          actions: [
            {
              icon: <Plus />,
              label: t("actions.enable"),
              onClick: handleCreate,
            },
          ],
        },
      ]

  return (
    <Container className="p-0">
      <div className="flex flex-col divide-y">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">
            {t(`stockLocations.fulfillmentSets.${type}.header`)}
          </Heading>
          <div className="flex items-center gap-4">
            <StatusBadge color={fulfillmentSetExists ? "green" : "grey"}>
              {t(
                fulfillmentSetExists ? "statuses.enabled" : "statuses.disabled"
              )}
            </StatusBadge>

            <ActionMenu groups={groups} />
          </div>
        </div>

        {fulfillmentSetExists && !hasServiceZones && (
          <div className="flex items-center justify-center py-8 pt-6">
            <NoRecords
              message={t("stockLocations.serviceZones.fields.noRecords")}
              className="h-fit"
              action={{
                to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`,
                label: t("stockLocations.serviceZones.create.action"),
              }}
            />
          </div>
        )}

        {hasServiceZones && (
          <div className="flex flex-col divide-y">
            {fulfillmentSet?.service_zones.map((zone) => (
              <ServiceZone
                zone={zone}
                key={zone.id}
                locationId={locationId}
                fulfillmentSetId={fulfillmentSet.id}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

const Actions = ({ location }: { location: HttpTypes.AdminStockLocation }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mutateAsync } = useDeleteStockLocation(location.id)
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("stockLocations.delete.confirmation", {
        name: location.name,
      }),
      verificationText: location.name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(
          t("stockLocations.create.successToast", {
            name: location.name,
          })
        )
        navigate("/settings/locations", { replace: true })
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `edit`,
            },
            {
              icon: <ArchiveBox />,
              label: t("stockLocations.edit.viewInventory"),
              to: `/inventory?location_id=${location.id}`,
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
