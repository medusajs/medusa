import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, IconButton, Skeleton, Text } from "@medusajs/ui"
import { useCustomerAddress } from "@medusajs/dashboard/hooks"
import { getFormattedAddress } from "@medusajs/dashboard/lib"

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
    <div className="bg-ui-bg-component shadow-elevation-card-rest flex items-center gap-4 rounded-lg px-3 py-2">
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
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-16" />
    </div>
  )
}

interface AddressInfoProps {
  address: HttpTypes.AdminCustomerAddress
}

const AddressInfo = ({ address }: AddressInfoProps) => {
  const addressSegments = getFormattedAddress({ address })

  return (
    <div className="flex flex-1 flex-col">
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
