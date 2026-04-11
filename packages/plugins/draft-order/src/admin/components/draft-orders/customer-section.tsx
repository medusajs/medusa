import { ArrowPath, CurrencyDollar, Envelope, FlyingBox } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Avatar, Container, Copy, Heading, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"
import {
  getFormattedAddress,
  isSameAddress,
} from "../../lib/utils/address-utils"
import { getOrderCustomer } from "../../lib/utils/order-utils"
import { ActionMenu } from "../common/action-menu"

interface CustomerSectionProps {
  order: HttpTypes.AdminOrder
}

export const CustomerSection = ({ order }: CustomerSectionProps) => {
  return (
    <Container className="p-0 divide-y">
      <Header />
      <ID order={order} />
      <Contact order={order} />
      <Addresses order={order} />
    </Container>
  )
}

const Header = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 gap-2">
      <Heading level="h2">Customer</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: "Transfer ownership",
                to: "transfer-ownership",
                icon: <ArrowPath />,
              },
            ],
          },
          {
            actions: [
              {
                label: "Edit shipping address",
                to: "shipping-address",
                icon: <FlyingBox />,
              },
              {
                label: "Edit billing address",
                to: "billing-address",
                icon: <CurrencyDollar />,
              },
            ],
          },
          {
            actions: [
              {
                label: "Edit email",
                to: `email`,
                icon: <Envelope />,
              },
            ],
          },
        ]}
      />
    </div>
  )
}

const ID = ({ order }: CustomerSectionProps) => {
  const id = order.customer_id
  const name = getOrderCustomer(order)
  const email = order.email
  const fallback = (name || email || "").charAt(0).toUpperCase()

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        ID
      </Text>
      <Link
        to={`/customers/${id}`}
        className="focus:shadow-borders-focus rounded-[4px] outline-none transition-shadow"
      >
        <div className="flex items-center gap-x-2">
          <Avatar size="2xsmall" fallback={fallback} />
          <div className="flex flex-1 overflow-hidden">
            <Text
              size="small"
              leading="compact"
              className="text-ui-fg-subtle hover:text-ui-fg-base transition-fg truncate"
            >
              {name || email}
            </Text>
          </div>
        </div>
      </Link>
    </div>
  )
}

const Contact = ({ order }: CustomerSectionProps) => {
  const phone = order.shipping_address?.phone || order.billing_address?.phone
  const email = order.email || ""

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Contact
      </Text>
      <div className="flex flex-col gap-y-2">
        <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
          <Text
            size="small"
            leading="compact"
            className="text-pretty break-all"
          >
            {email}
          </Text>

          <div className="flex justify-end">
            <Copy content={email} className="text-ui-fg-muted" />
          </div>
        </div>
        {phone && (
          <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
            <Text
              size="small"
              leading="compact"
              className="text-pretty break-all"
            >
              {phone}
            </Text>

            <div className="flex justify-end">
              <Copy content={phone} className="text-ui-fg-muted" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AddressPrint = ({
  address,
  type,
}: {
  address:
    | HttpTypes.AdminOrder["shipping_address"]
    | HttpTypes.AdminOrder["billing_address"]
  type: "shipping" | "billing"
}) => {
  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {type === "shipping" ? "Shipping address" : "Billing address"}
      </Text>
      {address ? (
        <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
          <Text size="small" leading="compact">
            {getFormattedAddress(address).map((line, i) => {
              return (
                <span key={i} className="break-words">
                  {line}
                  <br />
                </span>
              )
            })}
          </Text>
          <div className="flex justify-end">
            <Copy
              content={getFormattedAddress(address).join("\n")}
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

const Addresses = ({ order }: CustomerSectionProps) => {
  return (
    <div className="divide-y">
      <AddressPrint address={order.shipping_address} type="shipping" />
      {!isSameAddress(order.shipping_address, order.billing_address) ? (
        <AddressPrint address={order.billing_address} type="billing" />
      ) : (
        <div className="grid grid-cols-2 items-center px-6 py-4">
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-ui-fg-subtle"
          >
            Billing address
          </Text>
          <Text size="small" leading="compact" className="text-ui-fg-muted">
            Same as shipping address
          </Text>
        </div>
      )}
    </div>
  )
}
