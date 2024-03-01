import { Address as MedusaAddress, Order } from "@medusajs/medusa"
import { Avatar, Container, Copy, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { ArrowPath, CurrencyDollar, Envelope, FlyingBox } from "@medusajs/icons"
import { ActionMenu } from "../../../../../components/common/action-menu"

type OrderCustomerSectionProps = {
  order: Order
}

export const OrderCustomerSection = ({ order }: OrderCustomerSectionProps) => {
  return (
    <Container className="divide-y p-0">
      <Header order={order} />
      <ID order={order} />
      <Contact order={order} />
      <Company order={order} />
      <Addresses order={order} />
    </Container>
  )
}

const Header = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.customer")}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("orders.customer.transferOwnership"),
                to: `#`, // TODO: Open modal to transfer ownership
                icon: <ArrowPath />,
              },
            ],
          },
          {
            actions: [
              {
                label: t("orders.customer.editShippingAddress"),
                to: `#`, // TODO: Open modal to edit shipping address
                icon: <FlyingBox />,
              },
              {
                label: t("orders.customer.editBillingAddress"),
                to: `#`, // TODO: Open modal to edit billing address
                icon: <CurrencyDollar />,
              },
            ],
          },
          {
            actions: [
              {
                label: t("orders.customer.editEmail"),
                to: `#`, // TODO: Open modal to edit email
                icon: <Envelope />,
              },
            ],
          },
        ]}
      />
    </div>
  )
}

const getCustomerName = (order: Order) => {
  const { first_name: sFirstName, last_name: sLastName } =
    order.shipping_address || {}
  const { first_name: bFirstName, last_name: bLastName } =
    order.billing_address || {}
  const { first_name: cFirstName, last_name: cLastName } = order.customer || {}

  const customerName = [cFirstName, cLastName].filter(Boolean).join(" ")
  const shippingName = [sFirstName, sLastName].filter(Boolean).join(" ")
  const billingName = [bFirstName, bLastName].filter(Boolean).join(" ")

  const name = customerName || shippingName || billingName

  return name
}

const ID = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  const id = order.customer_id
  const name = getCustomerName(order)
  const email = order.email
  const fallback = (name || email).charAt(0).toUpperCase()

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("fields.id")}
      </Text>
      <Link
        to={`/customers/${id}`}
        className="focus:shadow-borders-focus rounded-[4px] outline-none transition-shadow"
      >
        <div className="flex items-center gap-x-2 overflow-hidden">
          <Avatar size="2xsmall" fallback={fallback} />
          <Text
            size="small"
            leading="compact"
            className="text-ui-fg-subtle hover:text-ui-fg-base transition-fg truncate"
          >
            {name || email}
          </Text>
        </div>
      </Link>
    </div>
  )
}

const Company = ({ order }: { order: Order }) => {
  const { t } = useTranslation()
  const company =
    order.shipping_address?.company || order.billing_address?.company

  if (!company) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("fields.company")}
      </Text>
      <Text size="small" leading="compact" className="truncate">
        {company}
      </Text>
    </div>
  )
}

const Contact = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  const phone = order.shipping_address?.phone || order.billing_address?.phone
  const email = order.email

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("orders.customer.contactLabel")}
      </Text>
      <div className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2 items-start gap-x-2">
          <div className="w-full">
            <Text
              size="small"
              leading="compact"
              className="whitespace-normal text-pretty"
            >
              {email}
            </Text>
          </div>
          <div className="flex justify-end">
            <Copy content={email} className="text-ui-fg-muted" />
          </div>
        </div>
        {phone && (
          <div className="grid grid-cols-2 items-start gap-x-2">
            <div className="w-full">
              <Text
                size="small"
                leading="compact"
                className="whitespace-normal text-pretty"
              >
                {phone}
              </Text>
            </div>
            <div className="flex justify-end">
              <Copy content={email} className="text-ui-fg-muted" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const isSameAddress = (a: MedusaAddress | null, b: MedusaAddress | null) => {
  if (!a || !b) {
    return false
  }

  return (
    a.first_name === b.first_name &&
    a.last_name === b.last_name &&
    a.address_1 === b.address_1 &&
    a.address_2 === b.address_2 &&
    a.city === b.city &&
    a.postal_code === b.postal_code &&
    a.province === b.province &&
    a.country_code === b.country_code
  )
}

const getFormattedAddress = ({ address }: { address: MedusaAddress }) => {
  const {
    first_name,
    last_name,
    company,
    address_1,
    address_2,
    city,
    postal_code,
    province,
    country,
  } = address

  const name = [first_name, last_name].filter(Boolean).join(" ")

  const formattedAddress = []

  if (name) {
    formattedAddress.push(name)
  }

  if (company) {
    formattedAddress.push(company)
  }

  if (address_1) {
    formattedAddress.push(address_1)
  }

  if (address_2) {
    formattedAddress.push(address_2)
  }

  const cityProvincePostal = [city, province, postal_code]
    .filter(Boolean)
    .join(" ")

  if (cityProvincePostal) {
    formattedAddress.push(cityProvincePostal)
  }

  if (country) {
    formattedAddress.push(country.display_name)
  }

  return formattedAddress
}

const Address = ({
  address,
  type,
}: {
  address: MedusaAddress | null
  type: "shipping" | "billing"
}) => {
  const { t } = useTranslation()

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {type === "shipping"
          ? t("addresses.shippingAddress")
          : t("addresses.billingAddress")}
      </Text>
      {address ? (
        <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
          <Text size="small" leading="compact">
            {getFormattedAddress({ address }).map((line, i) => {
              return (
                <span key={i}>
                  {line}
                  <br />
                </span>
              )
            })}
          </Text>
          <div className="flex justify-end">
            <Copy
              content={getFormattedAddress({ address }).join("\n")}
              className="text-ui-fg-muted"
            />
          </div>
        </div>
      ) : (
        <Text size="small" leading="compact">
          -
        </Text>
      )}
    </div>
  )
}

const Addresses = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  return (
    <div className="divide-y">
      <Address address={order.shipping_address} type="shipping" />
      {!isSameAddress(order.shipping_address, order.billing_address) ? (
        <Address address={order.billing_address} type="billing" />
      ) : (
        <div className="grid grid-cols-2 items-center px-6 py-4">
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-ui-fg-subtle"
          >
            {t("addresses.billingAddress")}
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-muted">
            {t("addresses.sameAsShipping")}
          </Text>
        </div>
      )}
    </div>
  )
}
