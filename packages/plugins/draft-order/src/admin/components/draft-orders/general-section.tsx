import { usePermissions } from "@medusajs/dashboard/hooks"
import { Channels, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Badge,
  Container,
  Copy,
  Heading,
  Skeleton,
  Text,
  toast,
} from "@medusajs/ui"
import { Link, useNavigate } from "react-router-dom"
import { useRegion } from "../../hooks/api/regions"
import { getFullDate } from "../../lib/utils/date-utils"
import { ActionMenu } from "../common/action-menu"
import { useDeleteDraftOrder } from "../../hooks/api/draft-orders"
import { EDIT_DRAFT_ORDER_SALES_CHANNEL_PERMISSIONS } from "../../lib/permissions"

interface GeneralSectionProps {
  order: HttpTypes.AdminOrder
}

export const GeneralSection = ({ order }: GeneralSectionProps) => {
  const navigate = useNavigate()
  const { hasPermission, hasAllPermissions } = usePermissions()
  const canReadRegion = hasPermission("region:read")
  const canEditSalesChannel = hasAllPermissions(
    EDIT_DRAFT_ORDER_SALES_CHANNEL_PERMISSIONS
  )
  const canDelete = hasPermission("order:delete")

  const { mutateAsync: deleteDraftOrder, isPending: isDeleting } =
    useDeleteDraftOrder()

  const { region, isPending, isError, error } = useRegion(
    order.region_id!,
    undefined,
    {
      enabled: canReadRegion && !!order.region_id,
    }
  )

  const isRegionLoaded = !!region && !isPending

  if (isError) {
    throw error
  }

  return (
    <Container className="flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-x-2">
          <Heading>Draft Order #{order.display_id}</Heading>
          <Copy content={`#${order.display_id}`} />
          {canReadRegion &&
            (isRegionLoaded ? (
              <Badge size="2xsmall" rounded="full" asChild>
                <Link to={`/settings/regions/${region?.id}`}>
                  {region?.name}
                </Link>
              </Badge>
            ) : (
              <Skeleton className="w-14 h-5 rounded-full" />
            ))}
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          {`${getFullDate({
            date: order.created_at,
            includeTime: true,
          })} from ${order.sales_channel?.name}`}
        </Text>
      </div>
      {(canEditSalesChannel || canDelete) && (
        <ActionMenu
          groups={[
            {
              actions: [
                ...(canEditSalesChannel
                  ? [
                      {
                        label: "Edit sales channel",
                        icon: <Channels />,
                        to: "sales-channel",
                      },
                    ]
                  : []),
                ...(canDelete
                  ? [
                      {
                        label: "Delete draft order",
                        icon: <Trash />,
                        onClick: async () => {
                          try {
                            await deleteDraftOrder(order.id)
                            navigate("/draft-orders")
                          } catch (error: any) {
                            toast.error(error.message)
                          }
                        },
                        disabled: isDeleting,
                      },
                    ]
                  : []),
              ],
            },
          ]}
        />
      )}
    </Container>
  )
}
