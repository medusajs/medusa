import {
  Buildings,
  Shopping,
  TriangleRightMini,
  TruckFast,
} from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import {
  Badge,
  Button,
  clx,
  Container,
  Divider,
  Heading,
  IconButton,
  StatusBadge,
  Text,
  Tooltip,
} from "@zjedene-medusa/ui"
import { Accordion } from "radix-ui"
import { Link } from "react-router-dom"

import { useShippingOptions } from "../../hooks/api/shipping-options"
import { getUniqueShippingProfiles } from "../../lib/utils/order-utils"
import { pluralize } from "../../lib/utils/string-utils"
import { Thumbnail } from "../common/thumbnail"
import { useMemo } from "react"

interface ShippingSectionProps {
  order: HttpTypes.AdminOrder
}

export const ShippingSection = ({ order }: ShippingSectionProps) => {
  const orderHasShipping = order.shipping_methods.length > 0

  const {
    shipping_options = [],
    isPending,
    isError,
    error,
  } = useShippingOptions(
    {
      id: order.shipping_methods
        .map((method) => method.shipping_option_id)
        .filter(Boolean) as string[],
      fields:
        "+service_zone.*,+service_zone.fulfillment_set.*,+service_zone.fulfillment_set.location.*,shipping_profile.*",
    },
    {
      enabled: orderHasShipping,
    }
  )

  if (isError) {
    throw error
  }

  const ready = !orderHasShipping ? true : shipping_options && !isPending

  const data = useMemo(() => {
    const shippingProfilesData = getShippingProfileData(order.items)

    // shipping profiles of the items on the order
    const profileIdMap = new Map<string, boolean>()
    shippingProfilesData.forEach((profile) => {
      profileIdMap.set(profile.id, true)
    })

    // shipping profiles of the shipping methods on the order
    const uniqueProfilesOfShippingMethods = Array.from(
      new Set(shipping_options.map((option) => option.shipping_profile_id))
    )

    // prepare data of shipping profiles that are handed by the order shipping methods but not on needed by the order items
    const additionalShippingProfilesData = uniqueProfilesOfShippingMethods
      .filter((id) => !profileIdMap.has(id))
      .map((id) => ({
        id,
        name:
          shipping_options.find((option) => option.shipping_profile_id === id)
            ?.shipping_profile?.name || "",
        items: [],
      }))

    const shippingProfileDisplayData = [
      ...shippingProfilesData,
      ...additionalShippingProfilesData,
    ]

    return shippingProfileDisplayData.sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [order.items, shipping_options])

  const isSomeProfilesAssigned = data.some((profile) =>
    shipping_options?.find(
      (option) => option.shipping_profile_id === profile.id
    )
  )

  return (
    <Container className="p-0 overflow-hidden">
      <div className="px-6 py-4">
        <Heading>Shipping</Heading>
      </div>
      <Divider variant="dashed" />
      <Accordion.Root type="multiple">
        {ready &&
          data.map((profile, idx) => (
            <div key={profile.id}>
              {renderShippingProfile(
                profile,
                shipping_options,
                idx === data.length - 1
              )}
            </div>
          ))}
      </Accordion.Root>

      <Divider variant="dashed" />
      <Footer isSomeProfilesAssigned={isSomeProfilesAssigned} />
    </Container>
  )
}

function renderShippingProfile(
  profile: ShippingProfileData,
  shippingOptions: HttpTypes.AdminShippingOption[],
  isLast: boolean
) {
  const shippingOption = shippingOptions.find(
    (option) => option.shipping_profile_id === profile.id
  )

  if (shippingOption) {
    return (
      <ProfileWithShipping
        profile={profile}
        shippingOption={shippingOption}
        isLast={isLast}
      />
    )
  }

  return <ProfileWithoutShipping profile={profile} isLast={isLast} />
}

interface ProfileWithShipping {
  profile: ShippingProfileData
  shippingOption: HttpTypes.AdminShippingOption
  isLast?: boolean
}

const ProfileWithShipping = ({
  profile,
  shippingOption,
  isLast,
}: ProfileWithShipping) => {
  const hasItems = profile.items.length > 0

  return (
    <div>
      <Accordion.Item value={profile.id}>
        <div className="flex items-center px-6 py-4 justify-between gap-x-3">
          <div className="flex items-center gap-x-3 max-sm:items-start">
            <Accordion.Trigger asChild>
              <IconButton
                size="2xsmall"
                variant="transparent"
                className="group/trigger"
                disabled={!hasItems}
              >
                <TriangleRightMini className="group-data-[state=open]/trigger:rotate-90 transition-transform" />
              </IconButton>
            </Accordion.Trigger>
            <div className="flex items-center gap-[5px] max-sm:flex-col max-sm:items-start flex-1 w-full overflow-hidden">
              <Tooltip
                content={
                  <ul>
                    {profile.items.map((item) => (
                      <li
                        key={item.id}
                      >{`${item.quantity}x ${item.variant?.product?.title} (${item.variant?.title})`}</li>
                    ))}
                  </ul>
                }
              >
                <Badge
                  className="flex items-center gap-x-[3px] overflow-hidden cursor-default"
                  size="xsmall"
                >
                  <Shopping className="shrink-0" />
                  <span className="truncate">
                    {profile.items.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                    )}
                    x {pluralize(profile.items.length, "items", "item")}
                  </span>
                </Badge>
              </Tooltip>
              <Tooltip
                content={
                  shippingOption.service_zone?.fulfillment_set?.location?.name
                }
              >
                <Badge
                  className="flex items-center gap-x-[3px] overflow-hidden cursor-default"
                  size="xsmall"
                >
                  <Buildings className="shrink-0" />
                  <span className="truncate">
                    {
                      shippingOption.service_zone?.fulfillment_set?.location
                        ?.name
                    }
                  </span>
                </Badge>
              </Tooltip>
              <Tooltip content={shippingOption.name}>
                <Badge
                  className="flex items-center gap-x-[3px] overflow-hidden cursor-default"
                  size="xsmall"
                >
                  <TruckFast className="shrink-0" />
                  <span className="truncate">{shippingOption.name}</span>
                </Badge>
              </Tooltip>
            </div>
          </div>
        </div>
        <ShippingProfileItems profile={profile} />
      </Accordion.Item>
      {!isLast && <Divider variant="dashed" />}
    </div>
  )
}

interface ProfileWithoutShippingProps {
  profile: ShippingProfileData
  isLast?: boolean
}

const ProfileWithoutShipping = ({
  profile,
  isLast,
}: ProfileWithoutShippingProps) => {
  return (
    <div>
      <Accordion.Item value={profile.id}>
        <div className="flex items-center gap-x-3 justify-between px-6 py-4">
          <div className="flex items-center gap-x-3">
            <Accordion.Trigger asChild>
              <IconButton
                size="2xsmall"
                variant="transparent"
                className="group/trigger"
              >
                <TriangleRightMini className="group-data-[state=open]/trigger:rotate-90 transition-transform" />
              </IconButton>
            </Accordion.Trigger>
            <div className="flex-1 flex items-center gap-x-3">
              <ShippingBadge />
              <div>
                <Text size="small" weight="plus" leading="compact">
                  {profile.name}
                </Text>
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {`${profile.items.length} ${pluralize(
                    profile.items.length,
                    "item",
                    "items"
                  )}`}
                </Text>
              </div>
            </div>
          </div>
          <div>
            <StatusBadge color="orange">Requires shipping</StatusBadge>
          </div>
        </div>
        <ShippingProfileItems profile={profile} />
      </Accordion.Item>
      {!isLast && <Divider variant="dashed" />}
    </div>
  )
}

interface ShippingProfileItemsProps {
  profile: ShippingProfileData
}

const ShippingProfileItems = ({ profile }: ShippingProfileItemsProps) => {
  return (
    <Accordion.Content>
      <Divider variant="dashed" />
      {profile.items.map((item, idx) => {
        return (
          <div key={item.id}>
            <div className="px-6 flex items-center gap-x-3" key={item.id}>
              <div className="w-5 h-[72px] flex flex-col justify-center items-center">
                <Divider variant="dashed" orientation="vertical" />
              </div>
              <div className="py-4 flex items-center gap-x-3">
                <div className="size-7 flex items-center justify-center tabular-nums">
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-subtle"
                  >
                    {item.quantity}x
                  </Text>
                </div>
                <Thumbnail thumbnail={item.thumbnail} />
                <div>
                  <Text size="small" leading="compact" weight="plus">
                    {item.variant?.product?.title} ({item.variant?.title})
                  </Text>
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-subtle"
                  >
                    {item.variant?.options
                      ?.map((option) => option.value)
                      .join(" · ")}
                  </Text>
                </div>
              </div>
            </div>
            {idx !== profile.items.length - 1 && <Divider variant="dashed" />}
          </div>
        )
      })}
    </Accordion.Content>
  )
}

interface FooterProps {
  isSomeProfilesAssigned: boolean
}

const Footer = ({ isSomeProfilesAssigned }: FooterProps) => {
  return (
    <div className="px-6 py-4 flex items-center justify-end bg-ui-bg-component">
      <Button size="small" variant="secondary" asChild>
        <Link to="shipping">
          {isSomeProfilesAssigned ? "Edit shipping" : "Add shipping"}
        </Link>
      </Button>
    </div>
  )
}

interface ShippingBadgeProps {
  className?: string
}

const ShippingBadge = ({ className }: ShippingBadgeProps) => {
  return (
    <div
      className={clx(
        "size-7 rounded-md shadow-borders-base flex items-center justify-center",
        className
      )}
    >
      <div className="size-6 rounded bg-ui-bg-component-hover flex items-center justify-center">
        <Shopping className="text-ui-fg-subtle" />
      </div>
    </div>
  )
}

interface ShippingProfileData {
  id: string
  name: string
  items: HttpTypes.AdminOrderLineItem[]
}

function getShippingProfileData(
  items: HttpTypes.AdminOrderLineItem[]
): ShippingProfileData[] {
  const uniqueShippingProfiles = getUniqueShippingProfiles(items)

  const output = uniqueShippingProfiles.map((profile) => {
    return {
      id: profile.id,
      name: profile.name,
      items: items.filter(
        (item) => item.variant?.product?.shipping_profile?.id === profile.id
      ),
    }
  })

  return output
}
