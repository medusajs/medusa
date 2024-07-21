import {
  EllipseGreenSolid,
  EllipseGreySolid,
  EllipseOrangeSolid,
  EllipseRedSolid,
  EllipsisHorizontal,
  PencilSquare,
  Trash,
} from "@medusajs/icons"
import type { PriceList } from "@medusajs/medusa"
import {
  Badge,
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Text,
  Tooltip,
  usePrompt,
} from "@medusajs/ui"
import { format } from "date-fns"
import { useAdminDeletePriceList, useAdminUpdatePriceList } from "medusa-react"
import * as React from "react"
import { useNavigate } from "react-router-dom"

import { useTranslation } from "react-i18next"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { PriceListStatus } from "../../forms/price-list-details-form"
import { EditDetailsDrawer } from "./details-drawer"

type PriceListDetailsSectionProps = {
  priceList: PriceList
}

const PriceListDetailsSection = ({
  priceList,
}: PriceListDetailsSectionProps) => {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const { t } = useTranslation()

  const prompt = usePrompt()
  const notification = useNotification()

  const navigate = useNavigate()

  const { mutateAsync } = useAdminDeletePriceList(priceList.id)

  const onDeletePriceList = async () => {
    const name = priceList.name

    const confirmText =
      t("price-list-details-section-prompt-confirm-text", "Delete") ?? undefined
    const cancelText =
      t("price-list-details-section-prompt-cancel-text", "Cancel") ?? undefined

    const res = await prompt({
      title: t("price-list-details-section-prompt-title", "Delete price list"),
      description: t(
        "price-list-details-section-prompt-description",
        `Are you sure you want to delete the price list "{{name}}"?`,
        {
          name,
        }
      ),
      verificationText: name,
      confirmText,
      cancelText,
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        notification(
          t(
            "price-list-details-section-delete-notification-success-title",
            "Successfully deleted price list"
          ),
          t(
            "price-list-details-section-delete-notification-success-message",
            `The price list "{{name}}" was successfully deleted`,
            { name }
          ),
          `success`
        )

        navigate(`/a/price-lists`, { replace: true })
      },
      onError: (err) => {
        notification(
          t(
            "price-list-details-section-delete-notification-error-title",
            "Failed to delete price list"
          ),
          getErrorMessage(err),
          `error`
        )
      },
    })
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-y-1 pb-6">
          <div className="flex items-center justify-between">
            <Heading>{priceList.name}</Heading>
            <div className="flex items-center gap-x-2">
              <PriceListStatusMenu
                priceListId={priceList.id}
                status={priceList.status}
                endsAt={priceList.ends_at}
                startsAt={priceList.starts_at}
              />
              <PriceListMenu
                onOpenDrawer={toggleDrawer}
                onDelete={onDeletePriceList}
              />
            </div>
          </div>
          <Text>{priceList?.description}</Text>
        </div>
        <div className="small:grid-cols-2 medium:grid-cols-3 grid grid-cols-1 gap-6">
          <div className="border-ui-border-base flex flex-col gap-y-1 border-l px-4">
            <Text size="base" className="text-ui-fg-subtle">
              {t(
                "price-list-details-section-customer-groups",
                "Customer Groups"
              )}
            </Text>
            {(priceList.customer_groups?.length ?? 0) > 0 ? (
              <div className="flex items-center justify-between">
                <Text size="large">
                  {priceList.customer_groups
                    .slice(0, 2)
                    .map((cg) => cg.name)
                    .join(", ")}
                </Text>
                {(priceList.customer_groups?.length || 0) > 2 && (
                  <Tooltip
                    content={
                      <div className="flex flex-col">
                        {priceList.customer_groups.slice(2).map((group) => {
                          return (
                            <Text size="small" key={group.id}>
                              {group.name}
                            </Text>
                          )
                        })}
                      </div>
                    }
                  >
                    <Badge size="small" className="cursor-default">
                      +{priceList.customer_groups.length - 2}
                    </Badge>
                  </Tooltip>
                )}
              </div>
            ) : (
              <Text size="large" className="text-ui-fg-muted">
                -
              </Text>
            )}
          </div>
          <div className="border-ui-border-base flex flex-col gap-y-1 border-s px-4">
            <Text size="base" className="text-ui-fg-subtle">
              {t("price-list-details-section-last-edited", "Last edited")}
            </Text>
            <Text size="large">
              {format(new Date(priceList.updated_at), "EEE d, MMM yyyy")}
            </Text>
          </div>
          <div className="border-ui-border-base flex flex-col gap-y-1 border-s px-4">
            <Text size="base" className="text-ui-fg-subtle">
              {t("price-list-details-section-number-of-prices", "Prices")}
            </Text>
            <Text size="large">{priceList.prices.length ?? 0}</Text>
          </div>
        </div>
      </Container>
      <EditDetailsDrawer
        onOpenChange={setOpen}
        open={open}
        priceList={priceList}
      />
    </div>
  )
}

type PriceListStatusMenuProps = {
  status: PriceList["status"]
  endsAt: PriceList["ends_at"]
  startsAt: PriceList["starts_at"]
  priceListId: string
}

const PriceListStatusMenu = ({
  status,
  endsAt,
  startsAt,
  priceListId,
}: PriceListStatusMenuProps) => {
  const { t } = useTranslation()
  const notification = useNotification()

  const { mutateAsync } = useAdminUpdatePriceList(priceListId)

  const isActive = status === "active"
  const isExpired = endsAt ? new Date(endsAt) < new Date() : false
  const isScheduled = startsAt ? new Date(startsAt) > new Date() : false

  const statusText = React.useMemo(() => {
    if (isExpired) {
      return t("price-list-details-section-status-menu-expired", "Expired")
    }

    if (status === "draft") {
      return t("price-list-details-section-status-menu-draft", "Draft")
    }

    if (isScheduled) {
      return t("price-list-details-section-status-menu-scheduled", "Scheduled")
    }

    return t("price-list-details-section-status-active", "Active")
  }, [status, t, isExpired, isScheduled])

  const statusDot = React.useMemo(() => {
    if (isExpired) {
      return <EllipseRedSolid />
    }

    if (status === "draft") {
      return <EllipseGreySolid />
    }

    if (isScheduled) {
      return <EllipseOrangeSolid />
    }

    return <EllipseGreenSolid />
  }, [status, isExpired, isScheduled])

  const onUpdateStatus = async () => {
    const newStatus = isActive ? PriceListStatus.DRAFT : PriceListStatus.ACTIVE

    mutateAsync(
      {
        status: newStatus,
      },
      {
        onSuccess: () => {
          notification(
            t(
              "price-list-details-section-status-menu-notification-success-title",
              "Successfully updated price list status"
            ),
            t(
              "price-list-details-section-status-menu-notification-success-message",
              `The price list status was successfully updated to {{status}}`,
              { status: newStatus }
            ),
            `success`
          )
        },
        onError: (err) => {
          notification(
            t(
              "price-list-details-section-status-menu-notification-error-title",
              "Failed to update price list status"
            ),
            getErrorMessage(err),
            `error`
          )
        },
      }
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild disabled={isExpired}>
        <Button
          variant="secondary"
          className="!text-ui-fg-base flex items-center !gap-x-1.5 pe-3 ps-2.5 capitalize"
        >
          {statusDot}
          {statusText}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="end"
        side="bottom"
        className="min-w-[200px]"
        onClick={onUpdateStatus}
      >
        <DropdownMenu.Item>
          {isActive ? <EllipseGreySolid /> : <EllipseGreenSolid />}
          <span>
            {isActive
              ? t("price-list-details-section-status-menu-item-draft", "Draft")
              : t(
                  "price-list-details-section-status-menu-item-activate",
                  "Activate"
                )}
          </span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

type PriceListMenuProps = {
  onDelete: () => Promise<void>
  onOpenDrawer: () => void
}

const PriceListMenu = ({ onDelete, onOpenDrawer }: PriceListMenuProps) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" side="bottom">
        <DropdownMenu.Item onClick={onOpenDrawer}>
          <PencilSquare className="text-ui-fg-subtle" />
          <span className="ms-2">
            {t("price-list-details-menu-item-edit", "Edit details")}
          </span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={onDelete}>
          <Trash className="text-ui-fg-subtle" />
          <span className="ms-2">
            {t("price-list-details-menu-item-delete", "Delete")}
          </span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export { PriceListDetailsSection as PriceListGeneralSection }
