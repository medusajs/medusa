import {
  ChevronDownMini,
  CurrencyDollar,
  Map,
  PencilSquare,
  Plus,
  Trash,
} from "@medusajs/icons"
import {
  FulfillmentSetDTO,
  ServiceZoneDTO,
  ShippingOptionDTO,
  StockLocationDTO,
} from "@medusajs/types"
import {
  Badge,
  Button,
  Container,
  Heading,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { ListSummary } from "../../../../../components/common/list-summary"
import { useDeleteShippingOption } from "../../../../../hooks/api/shipping-options"
import {
  useCreateFulfillmentSet,
  useDeleteFulfillmentSet,
  useDeleteServiceZone,
  useDeleteStockLocation,
} from "../../../../../hooks/api/stock-locations"
import { countries as staticCountries } from "../../../../../lib/countries"
import { formatProvider } from "../../../../../lib/format-provider"
import {
  isOptionEnabledInStore,
  isReturnOption,
} from "../../../../../lib/shipping-options"

type LocationGeneralSectionProps = {
  location: StockLocationDTO
}

export const LocationGeneralSection = ({
  location,
}: LocationGeneralSectionProps) => {
  return (
    <>
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading>{location.name}</Heading>
          <Actions location={location} />
        </div>
      </Container>

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
    </>
  )
}

type ShippingOptionProps = {
  option: ShippingOptionDTO
  fulfillmentSetId: string
  locationId: string
  isReturn?: boolean
}

function ShippingOption({
  option,
  isReturn,
  fulfillmentSetId,
  locationId,
}: ShippingOptionProps) {
  const prompt = usePrompt()
  const { t } = useTranslation()

  const isInStore = isOptionEnabledInStore(option)

  const { mutateAsync: deleteOption } = useDeleteShippingOption(option.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("location.shippingOptions.deleteWarning", {
        name: option.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await deleteOption()

      toast.success(t("general.success"), {
        description: t("location.shippingOptions.toast.delete", {
          name: option.name,
        }),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex-1">
        <span className="txt-small font-medium">
          {option.name} - {option.shipping_profile.name} (
          {formatProvider(option.provider_id)})
        </span>
      </div>
      {isInStore && (
        <Badge className="mr-4" color="purple">
          {t("location.shippingOptions.inStore")}
        </Badge>
      )}
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <PencilSquare />,
                label: t("location.serviceZone.editOption"),
                to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${option.service_zone_id}/shipping-option/${option.id}/edit`,
              },
              {
                label: t("location.serviceZone.editPrices"),
                icon: <CurrencyDollar />,
                to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${option.service_zone_id}/shipping-option/${option.id}/edit-pricing`,
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

  const shippingOptions = zone.shipping_options.filter(
    (o) => !isReturnOption(o)
  )

  const returnOptions = zone.shipping_options.filter((o) => isReturnOption(o))

  return (
    <>
      <div className="mt-4 flex flex-col border-t border-dashed px-6 py-4">
        <div className="item-center flex justify-between">
          <span className="text-ui-fg-subtle txt-small self-center font-medium">
            {t("location.serviceZone.shippingOptions")}
          </span>
          <Button
            className="text-ui-fg-interactive txt-small px-0 font-medium hover:bg-transparent active:bg-transparent"
            variant="transparent"
            onClick={() =>
              navigate(
                `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/shipping-option/create`
              )
            }
          >
            {t("location.serviceZone.addOption")}
          </Button>
        </div>

        {!!shippingOptions.length && (
          <div className="shadow-elevation-card-rest bg-ui-bg-subtle mt-4 grid divide-y rounded-md">
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

      <div className="-mb-4 flex flex-col border-t border-dashed px-6 py-4">
        <div className="item-center flex justify-between">
          <span className="text-ui-fg-subtle txt-small self-center font-medium">
            {t("location.serviceZone.returnOptions")}
          </span>
          <Button
            className="text-ui-fg-interactive txt-small px-0 font-medium hover:bg-transparent active:bg-transparent"
            variant="transparent"
            onClick={() =>
              navigate(
                `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/shipping-option/create?is_return`
              )
            }
          >
            {t("location.serviceZone.addOption")}
          </Button>
        </div>

        {!!returnOptions.length && (
          <div className="shadow-elevation-card-rest bg-ui-bg-subtle mt-4 grid divide-y rounded-md">
            {returnOptions.map((o) => (
              <ShippingOption
                key={o.id}
                isReturn
                option={o}
                locationId={locationId}
                fulfillmentSetId={fulfillmentSetId}
              />
            ))}
          </div>
        )}
      </div>
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
  const prompt = usePrompt()
  const [open, setOpen] = useState(false)

  const { mutateAsync: deleteZone } = useDeleteServiceZone(
    fulfillmentSetId,
    zone.id
  )

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("location.serviceZone.deleteWarning", {
        name: zone.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await deleteZone()

      toast.success(t("general.success"), {
        description: t("location.serviceZone.toast.delete", {
          name: zone.name,
        }),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  const countries = useMemo(() => {
    return zone.geo_zones
      .filter((g) => g.type === "country")
      .map((g) => g.country_code)
      .map((code) => staticCountries.find((c) => c.iso_2 === code))
      .sort((c1, c2) => c1.name.localeCompare(c2.name))
  }, zone.geo_zones)

  const [shippingOptionsCount, returnOptionsCount] = useMemo(() => {
    const optionsCount = zone.shipping_options.filter(
      (o) => !isReturnOption(o)
    ).length

    const returnOptionsCount = zone.shipping_options.filter((o) =>
      isReturnOption(o)
    ).length

    return [optionsCount, returnOptionsCount]
  }, [zone.shipping_options])

  return (
    <div className="py-4">
      <div className="flex flex-row items-center justify-between gap-x-4 px-6">
        {/* ICON*/}
        <div className="grow-0 rounded-lg border">
          <div className="bg-ui-bg-field m-1 rounded-md p-2">
            <Map className="text-ui-fg-subtle" />
          </div>
        </div>

        {/* INFO*/}
        <div className="grow-1 flex flex-1 flex-col">
          <Text weight="plus">{zone.name}</Text>
          <div className="flex items-center gap-2">
            <ListSummary
              list={countries.map((c) => c.display_name)}
              inline
              n={1}
            />
            <span>·</span>
            <Text className="text-ui-fg-subtle txt-small">
              {shippingOptionsCount}{" "}
              {t("location.serviceZone.optionsLength", {
                count: shippingOptionsCount,
              })}
            </Text>
            <span>·</span>
            <Text className="text-ui-fg-subtle txt-small">
              {returnOptionsCount}{" "}
              {t("location.serviceZone.returnOptionsLength", {
                count: returnOptionsCount,
              })}
            </Text>
          </div>
        </div>

        {/* ACTION*/}
        <div className="itemx-center flex grow-0 gap-1">
          <Button
            onClick={() => setOpen((s) => !s)}
            className="flex items-center justify-center"
            variant="transparent"
            style={{
              transform: `translateY(${!open ? -4 : -2}px)`,
              transition: ".1s transform ease-in-out",
            }}
          >
            <ChevronDownMini
              style={{
                transform: `rotate(${!open ? 0 : 180}deg)`,
                transition: ".2s transform ease-in-out",
              }}
            />
          </Button>
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
                    label: t("location.serviceZone.areas.manage"),
                    icon: <Map />,
                    to: `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSetId}/service-zone/${zone.id}/edit-areas`,
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
    </div>
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
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { fulfillmentSet, locationName, locationId, type } = props

  const fulfillmentSetExists = !!fulfillmentSet

  const hasServiceZones = !!fulfillmentSet?.service_zones.length

  const { mutateAsync: createFulfillmentSet, isPending: isLoading } =
    useCreateFulfillmentSet(locationId)

  const { mutateAsync: deleteFulfillmentSet } = useDeleteFulfillmentSet(
    fulfillmentSet?.id
  )

  const handleCreate = async () => {
    try {
      await createFulfillmentSet({
        name: `${locationName} ${
          type === FulfillmentSetType.Pickup ? "pick up" : type
        }`,
        type,
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("location.fulfillmentSet.disableWarning", {
        name: fulfillmentSet?.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await deleteFulfillmentSet()

      toast.success(t("general.success"), {
        description: t("location.fulfillmentSet.toast.disable", {
          name: fulfillmentSet?.name,
        }),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  return (
    <Container className="p-0">
      <div className="flex flex-col divide-y">
        <div className="flex items-center justify-between px-6 py-4">
          <Text size="large" weight="plus" className="flex-1" as="div">
            {t(`location.fulfillmentSet.${type}.offers`)}
          </Text>
          <div className="flex items-center gap-4">
            <StatusBadge color={fulfillmentSetExists ? "green" : "red"}>
              {t(
                fulfillmentSetExists ? "statuses.enabled" : "statuses.disabled"
              )}
            </StatusBadge>

            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      icon: <Plus />,
                      label: t("location.fulfillmentSet.addZone"),
                      onClick: () =>
                        navigate(
                          `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`
                        ),
                      disabled: !fulfillmentSetExists,
                    },
                    {
                      icon: <PencilSquare />,
                      label: fulfillmentSetExists
                        ? t("actions.disable")
                        : t("actions.enable"),
                      onClick: fulfillmentSetExists
                        ? handleDelete
                        : handleCreate,
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>

        {fulfillmentSetExists && !hasServiceZones && (
          <div className="text-ui-fg-muted txt-medium flex flex-col items-center justify-center gap-y-4 py-8">
            <NoRecords
              message={t("location.fulfillmentSet.placeholder")}
              className="h-fit"
            />

            <Button
              variant="secondary"
              onClick={() =>
                navigate(
                  `/settings/locations/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`
                )
              }
            >
              {t("location.fulfillmentSet.addZone")}
            </Button>
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

const Actions = ({ location }: { location: StockLocationDTO }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mutateAsync } = useDeleteStockLocation(location.id)
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("location.deleteLocationWarning", {
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

    try {
      await mutateAsync(undefined)
      toast.success(t("general.success"), {
        description: t("location.toast.delete"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
    navigate("/settings/locations", { replace: true })
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
