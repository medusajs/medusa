import { end, parse } from "iso8601-duration"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Badge from "../../fundamentals/badge"
import StatusDot from "../../fundamentals/status-indicator"

enum PromotionStatus {
  SCHEDULED = "SCHEDULED",
  EXPIRED = "EXPIRED",
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

const getPromotionStatus = (promotion) => {
  if (!promotion.is_disabled) {
    const date = new Date()
    if (new Date(promotion.starts_at) > date) {
      return PromotionStatus.SCHEDULED
    } else if (
      (promotion.ends_at && new Date(promotion.ends_at) < date) ||
      (promotion.valid_duration &&
        date >
          end(
            parse(promotion.valid_duration),
            new Date(promotion.starts_at)
          )) ||
      promotion.usage_count === promotion.usage_limit
    ) {
      return PromotionStatus.EXPIRED
    } else {
      return PromotionStatus.ACTIVE
    }
  }
  return PromotionStatus.DISABLED
}

const getPromotionStatusDot = (promotion, t) => {
  const status = getPromotionStatus(promotion)
  switch (status) {
    case PromotionStatus.SCHEDULED:
      return (
        <StatusDot
          title={t("discount-table-scheduled", "Scheduled")}
          variant="warning"
        />
      )
    case PromotionStatus.EXPIRED:
      return (
        <StatusDot
          title={t("discount-table-expired", "Expired")}
          variant="danger"
        />
      )
    case PromotionStatus.ACTIVE:
      return (
        <StatusDot
          title={t("discount-table-active", "Active")}
          variant="success"
        />
      )
    case PromotionStatus.DISABLED:
      return (
        <StatusDot
          title={t("discount-table-disabled", "Disabled")}
          variant="default"
        />
      )
    default:
      return (
        <StatusDot
          title={t("discount-table-disabled", "Disabled")}
          variant="default"
        />
      )
  }
}

const getCurrencySymbol = (promotion) => {
  if (promotion.rule.type === "fixed") {
    if (!promotion.regions?.length) {
      return ""
    }
    return promotion.regions[0].currency_code.toUpperCase()
  }
  return ""
}

const getPromotionAmount = (promotion, t) => {
  switch (promotion.rule.type) {
    case "fixed":
      if (!promotion.regions?.length) {
        return ""
      }
      return formatAmountWithSymbol({
        currency: promotion.regions[0].currency_code,
        amount: promotion.rule.value,
      })
    case "percentage":
      return `${promotion.rule.value}%`
    case "free_shipping":
      return t("discount-table-free-shipping", "Free Shipping")
    default:
      return ""
  }
}

export const usePromotionTableColumns = () => {
  const { t } = useTranslation()
  const columns = useMemo(
    () => [
      {
        Header: <div className="ps-2">{t("discount-table-code", "Code")}</div>,
        accessor: "code",
        Cell: ({ cell: { value } }) => (
          <div className="overflow-hidden">
            <Badge className="rounded-rounded" variant="default">
              <span className="inter-small-regular">{value}</span>
            </Badge>
          </div>
        ),
      },
      {
        Header: t("discount-table-description", "Description"),
        accessor: "rule.description",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: (
          <div className="text-end">{t("discount-table-amount", "Amount")}</div>
        ),
        id: "amount",
        Cell: ({ row: { original } }) => {
          return (
            <div className="text-end">{getPromotionAmount(original, t)}</div>
          )
        },
      },
      {
        Header: <div className="w-[60px]" />,
        id: "currency",
        Cell: ({ row: { original } }) => (
          <div className="text-grey-40 px-2">{getCurrencySymbol(original)}</div>
        ),
      },
      {
        Header: t("discount-table-status", "Status"),
        accessor: "ends_at",
        Cell: ({ row: { original } }) => (
          <div>{getPromotionStatusDot(original, t)}</div>
        ),
      },
      {
        Header: () => (
          <div className="text-end">
            {t("discount-table-redemptions", "Redemptions")}
          </div>
        ),
        accessor: "usage_count",
        Cell: ({ row: { original } }) => {
          return (
            <div className="text-end">
              {getUsageCount(original.usage_count)}
            </div>
          )
        },
      },
    ],
    []
  )

  return [columns]
}

const getUsageCount = (usageCount: number) => {
  switch (true) {
    case usageCount > 9999999:
      return `${Math.floor(usageCount / 1000000)}m`
    case usageCount > 9999:
      return `${Math.floor(usageCount / 1000)}k`
    default:
      return usageCount
  }
}
