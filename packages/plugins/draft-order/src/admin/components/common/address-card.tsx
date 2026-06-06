import { XMark } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import { Badge, IconButton, Skeleton, Text } from "@zjedene-medusa/ui"
import { useCustomerAddress } from "../../hooks/api/customers"
import { getFormattedAddress } from "../../lib/utils/address-utils"

interface AddressCardProps {
  customerId: string
  addressId: string
  tag?: "shipping" | "billing"
  onRemove?: () => void | Promise<void>
}

export const AddressCard = ({
  customerId,
  addressId,
  tag = "shipping",
  onRemove,
}: AddressCardProps) => {
  const { address, isPending, isError, error } = useCustomerAddress(
    customerId,
    addressId
  )

  if (isError) {
    throw error
  }

  const isReady = !isPending && !!address

  return (
    <div className="px-3 py-2 rounded-lg bg-ui-bg-component shadow-elevation-card-rest flex items-center gap-4">
      {!isReady ? <LoadingState /> : <AddressInfo address={address} />}
      <Badge size="2xsmall">
        {tag === "shipping" ? "Shipping" : "Billing"}
      </Badge>
      {onRemove && (
        <IconButton
          className="shrink-0"
          variant="transparent"
          size="small"
          onClick={onRemove}
          type="button"
        >
          <XMark />
        </IconButton>
      )}
    </div>
  )
}

const LoadingState = () => {
  return (
    <div className="flex flex-col gap-0.5">
      <Skeleton className="w-20 h-5" />
      <Skeleton className="w-16 h-5" />
      <Skeleton className="w-16 h-5" />
    </div>
  )
}

interface AddressInfoProps {
  address: HttpTypes.AdminCustomerAddress
}

const AddressInfo = ({ address }: AddressInfoProps) => {
  const addressSegments = getFormattedAddress(address)

  return (
    <div className="flex flex-col flex-1">
      {address.address_name && (
        <Text size="small" weight="plus" leading="compact">
          {address.address_name}
        </Text>
      )}
      {addressSegments.map((segment, idx) => (
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {segment}
          {idx < addressSegments.length - 1 && ", "}
        </Text>
      ))}
    </div>
  )
}
