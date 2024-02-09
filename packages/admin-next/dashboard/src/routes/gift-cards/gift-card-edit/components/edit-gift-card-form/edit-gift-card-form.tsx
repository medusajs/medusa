import { zodResolver } from "@hookform/resolvers/zod"
import { GiftCard } from "@medusajs/medusa"
import {
  Button,
  CurrencyInput,
  DatePicker,
  Drawer,
  Select,
  Switch,
  Text,
} from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useAdminRegions, useAdminUpdateGiftCard } from "medusa-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { currencies } from "../../../../../lib/currencies"
import { isAxiosError } from "../../../../../lib/is-axios-error"
import {
  getDbAmount,
  getPresentationalAmount,
} from "../../../../../lib/money-amount-helpers"

type EditGiftCardFormProps = {
  giftCard: GiftCard
  onSuccessfulSubmit: () => void
  subscribe: (state: boolean) => void
}

const EditGiftCardSchema = zod.object({
  region_id: zod.string(),
  balance: zod.string(),
  is_enabled: zod.boolean(),
  ends_at: zod.date().nullable(),
})

export const EditGiftCardForm = ({
  giftCard,
  onSuccessfulSubmit,
  subscribe,
}: EditGiftCardFormProps) => {
  const { t } = useTranslation()
  const [showDateFields, setShowDateFields] = useState(!!giftCard.ends_at)
  const form = useForm<zod.infer<typeof EditGiftCardSchema>>({
    defaultValues: {
      region_id: giftCard.region_id,
      balance: getPresentationalAmount(
        giftCard.balance,
        giftCard.region.currency_code
      ).toString(),
      is_enabled: !giftCard.is_disabled,
      ends_at: giftCard.ends_at ? new Date(giftCard.ends_at) : null,
    },
    resolver: zodResolver(EditGiftCardSchema),
  })

  const {
    formState: { isDirty },
    setValue,
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty, subscribe])

  const { regions } = useAdminRegions({
    limit: 1000,
    fields: "id,name",
  })

  const { mutateAsync, isLoading } = useAdminUpdateGiftCard(giftCard.id)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setValue("ends_at", null, {
        shouldDirty: true,
      })
    }

    setShowDateFields(open)
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const newBalance = getDbAmount(
      parseFloat(data.balance),
      giftCard.region.currency_code
    )

    if (newBalance > giftCard.value) {
      form.setError("balance", {
        type: "manual",
        message: t("giftCards.balanceHigherThanValue"),
      })
      return
    }

    if (newBalance < 0) {
      form.setError("balance", {
        type: "manual",
        message: t("giftCards.balanceLowerThanZero"),
      })
      return
    }

    await mutateAsync(
      {
        region_id: data.region_id,
        balance: getDbAmount(
          parseFloat(data.balance),
          giftCard.region.currency_code
        ),
        is_disabled: !data.is_enabled,
        ends_at: data.ends_at,
      },
      {
        onSuccess: () => {
          onSuccessfulSubmit()
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            form.setError("balance", {
              type: "manual",
              message: error.response?.data.message,
            })
          }
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <Drawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <Form.Field
            control={form.control}
            name="balance"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.balance")}</Form.Label>
                  <Form.Control>
                    <CurrencyInput
                      code={giftCard.region.currency_code.toUpperCase()}
                      symbol={`/ ${getPresentationalAmount(
                        giftCard.value,
                        giftCard.region.currency_code
                      )} ${
                        currencies[giftCard.region.currency_code.toUpperCase()]
                          .symbol_native
                      }`}
                      min={0}
                      {...field}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="region_id"
            render={({ field: { onChange, ref, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("fields.region")}</Form.Label>
                  <Form.Control>
                    <Select {...field} onValueChange={onChange}>
                      <Select.Trigger ref={ref}>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {regions?.map((region) => (
                          <Select.Item key={region.id} value={region.id}>
                            {region.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.Hint>{t("giftCards.regionHint")}</Form.Hint>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="is_enabled"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label>{t("general.enabled")}</Form.Label>
                    <Form.Control>
                      <Switch
                        checked={value}
                        onCheckedChange={onChange}
                        {...field}
                      />
                    </Form.Control>
                  </div>
                  <Form.Hint className="!mt-1">
                    {t("giftCards.enabledHint")}
                  </Form.Hint>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <div>
            <Collapsible.Root open={showDateFields}>
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center justify-between">
                  <Text size="small" leading="compact" weight="plus">
                    {t("fields.expiryDate")}
                  </Text>
                  <Switch
                    checked={showDateFields}
                    onCheckedChange={handleOpenChange}
                  />
                </div>
                <Text size="small" className="text-ui-fg-subtle text-pretty">
                  {t("giftCards.expiryDateHint")}
                </Text>
              </div>
              <Collapsible.Content>
                <div className="pt-4">
                  <Form.Field
                    control={form.control}
                    name="ends_at"
                    render={({
                      field: { value, onChange, ref: _ref, ...field },
                    }) => {
                      return (
                        <Form.Item>
                          <Form.Control>
                            <DatePicker
                              value={value ?? undefined}
                              onChange={(v) => {
                                onChange(v ?? null)
                              }}
                              {...field}
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center gap-x-2">
            <Drawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("general.cancel")}
              </Button>
            </Drawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("general.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
