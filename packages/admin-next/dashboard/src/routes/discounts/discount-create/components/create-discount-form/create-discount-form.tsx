import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormReturn, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { formatISODuration } from "date-fns"

import { Button } from "@medusajs/ui"
import { useAdminCreateDiscount, useAdminRegions } from "medusa-react"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { CreateDiscountDetails } from "./create-discount-details"
import { DiscountRuleType } from "./types"
import { getDbAmount } from "../../../../../lib/money-amount-helpers"

/**
 * There is some duplication here but we cannot achieve
 * expected behaviour from the form with only union + discriminateUnion
 */
const CreateDiscountSchema = zod.discriminatedUnion("type", [
  zod.object({
    code: zod.string(),
    regions: zod.array(zod.string()).min(1),
    is_dynamic: zod.boolean(),
    start_date: zod.date().optional(),
    end_date: zod.date().optional(),
    usage_limit: zod.number().optional(),
    description: zod.string().optional(),

    start_date_enabled: zod.boolean().optional(),
    end_date_enabled: zod.boolean().optional(),
    usage_limit_enabled: zod.boolean().optional(),
    valid_duration_enabled: zod.boolean().optional(),

    years: zod.number().optional(),
    months: zod.number().optional(),
    days: zod.number().optional(),
    hours: zod.number().optional(),
    minutes: zod.number().optional(),
    value: zod.number().min(0).max(100),
    type: zod.literal(DiscountRuleType.PERCENTAGE),
  }),
  zod.object({
    code: zod.string(),
    regions: zod.array(zod.string()).min(1),
    is_dynamic: zod.boolean(),
    start_date: zod.date().optional(),
    end_date: zod.date().optional(),
    usage_limit: zod.number().optional(),
    description: zod.string().optional(),

    start_date_enabled: zod.boolean().optional(),
    end_date_enabled: zod.boolean().optional(),
    usage_limit_enabled: zod.boolean().optional(),
    valid_duration_enabled: zod.boolean().optional(),

    years: zod.number().optional(),
    months: zod.number().optional(),
    days: zod.number().optional(),
    hours: zod.number().optional(),
    minutes: zod.number().optional(),

    value: zod.union([zod.string(), zod.number()]).refine((value) => {
      if (value === "") {
        return false
      }

      const num = Number(value)

      if (isNaN(num)) {
        return false
      }

      return num >= 0
    }, "Amount must be a positive number"),
    type: zod.literal(DiscountRuleType.FIXED),
  }),
  zod.object({
    code: zod.string(),
    regions: zod.array(zod.string()).min(1),
    is_dynamic: zod.boolean(),
    start_date: zod.date().optional(),
    end_date: zod.date().optional(),
    usage_limit: zod.number().optional(),
    description: zod.string().optional(),

    start_date_enabled: zod.boolean().optional(),
    end_date_enabled: zod.boolean().optional(),
    usage_limit_enabled: zod.boolean().optional(),
    valid_duration_enabled: zod.boolean().optional(),

    years: zod.number().optional(),
    months: zod.number().optional(),
    days: zod.number().optional(),
    hours: zod.number().optional(),
    minutes: zod.number().optional(),
    value: zod.undefined(),
    type: zod.literal(DiscountRuleType.FREE_SHIPPING),
  }),
])

type Schema = zod.infer<typeof CreateDiscountSchema>
export type CreateDiscountFormReturn = UseFormReturn<Schema>

export const CreateDiscountForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<Schema>({
    defaultValues: {
      regions: [],
      is_dynamic: false,
      type: DiscountRuleType.PERCENTAGE,
    },
    resolver: zodResolver(CreateDiscountSchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateDiscount()
  const { regions } = useAdminRegions()

  const handleSubmit = form.handleSubmit(async (values: Schema) => {
    const getValue = () => {
      if (values.type === DiscountRuleType.FREE_SHIPPING) {
        return 0
      }

      if (values.type === DiscountRuleType.PERCENTAGE) {
        return values.value
      }

      const amount =
        typeof values.value === "string" ? Number(values.value) : values.value

      const region = regions!.find((r) => r.id === values.regions[0])

      return getDbAmount(amount, region!.currency_code)
    }

    const duration = {
      years: values.years,
      months: values.months,
      days: values.days,
      hours: values.hours,
      minutes: values.minutes,
    }

    const isDurationEmpty = Object.values(duration).every((v) => !v)

    await mutateAsync(
      {
        code: values.code,
        regions: values.regions,
        is_dynamic: values.is_dynamic,
        starts_at: values.start_date_enabled ? values.start_date : undefined,
        ends_at: values.end_date_enabled ? values.end_date : undefined,
        is_disabled: false,
        usage_limit: values.usage_limit_enabled
          ? values.usage_limit
          : undefined,
        valid_duration:
          values.valid_duration_enabled && !isDurationEmpty
            ? formatISODuration(duration)
            : undefined,
        rule: {
          value: getValue(),
          type: values.type,
          description: values.description,
          allocation: "total" as any,
        },
      },
      {
        onSuccess: ({ discount }) => {
          handleSuccess(`../${discount.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex h-full w-full">
              <CreateDiscountDetails form={form} />
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
