import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  CurrencyInput,
  DatePicker,
  Heading,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
  Tooltip,
} from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useAdminCreateGiftCard, useAdminRegions } from "medusa-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { currencies } from "../../../../../lib/currencies"
import { getDbAmount } from "../../../../../lib/money-amount-helpers"

const CreateGiftCardSchema = zod.object({
  region_id: zod.string(),
  value: zod.string(),
  is_enabled: zod.boolean(),
  ends_at: zod.date().nullable(),
  email: zod.string().email(),
  personal_message: zod.string().optional(),
})

export const CreateGiftCardForm = () => {
  const [showDateFields, setShowDateFields] = useState(false)

  const { regions } = useAdminRegions({
    limit: 1000,
    fields: "id,name,currency_code",
  })
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateGiftCardSchema>>({
    defaultValues: {
      region_id: regions?.[0]?.id ?? "",
      value: "",
      is_enabled: true,
      ends_at: null,
      email: "",
      personal_message: "",
    },
    resolver: zodResolver(CreateGiftCardSchema),
  })

  const { setValue, setError } = form

  const regionId = useWatch({
    control: form.control,
    name: "region_id",
  })

  const currencyCode = regions?.find((r) => r.id === regionId)?.currency_code
  const nativeSymbol = currencyCode
    ? currencies[currencyCode.toUpperCase()].symbol_native
    : undefined

  const { mutateAsync, isLoading } = useAdminCreateGiftCard()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setValue("ends_at", null, {
        shouldDirty: true,
      })
    }

    setShowDateFields(open)
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!currencyCode) {
      setError("region_id", {
        type: "manual",
        message: t("giftCards.selectRegionFirst"),
      })

      return
    }

    await mutateAsync(
      {
        region_id: data.region_id,
        value: getDbAmount(parseFloat(data.value), currencyCode),
        is_disabled: !data.is_enabled,
        ends_at: data.ends_at ?? undefined,
        metadata: {
          email: data.email,
          personal_message: data.personal_message,
        },
      },
      {
        onSuccess: ({ gift_card }) => {
          handleSuccess(`../${gift_card.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("giftCards.createGiftCard")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("giftCards.createGiftCardHint")}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="value"
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("giftCards.balance")}</Form.Label>
                      <Form.Control>
                        {!currencyCode || !nativeSymbol ? (
                          <Tooltip content={t("giftCards.selectRegionFirst")}>
                            <Input disabled />
                          </Tooltip>
                        ) : (
                          <CurrencyInput
                            code={currencyCode.toUpperCase()}
                            symbol={nativeSymbol}
                            min={0}
                            onValueChange={onChange}
                            {...field}
                          />
                        )}
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
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
            <Form.Field
              control={form.control}
              name="ends_at"
              render={({ field: { value, onChange, ref: _ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Collapsible.Root open={showDateFields}>
                      <div className="flex flex-col gap-y-1">
                        <div className="flex items-center justify-between">
                          <Form.Label optional>
                            {t("fields.expiryDate")}
                          </Form.Label>
                          <Switch
                            checked={showDateFields}
                            onCheckedChange={handleOpenChange}
                          />
                        </div>
                        <Text
                          size="small"
                          className="text-ui-fg-subtle max-w-[85%] text-pretty"
                        >
                          {t("giftCards.expiryDateHint")}
                        </Text>
                      </div>
                      <Collapsible.Content>
                        <div className="grid grid-cols-2 pt-4">
                          <Form.Control>
                            <DatePicker
                              value={value ?? undefined}
                              onChange={(v) => {
                                onChange(v ?? null)
                              }}
                              {...field}
                            />
                          </Form.Control>
                        </div>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  </Form.Item>
                )
              }}
            />
            <div className="flex flex-col gap-y-4">
              <div className="grid grid-cols-2">
                <Form.Field
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.email")}</Form.Label>
                        <Form.Control>
                          <Input type="email" autoComplete="off" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Form.Field
                control={form.control}
                name="personal_message"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>
                        {t("giftCards.personalMessage")}
                      </Form.Label>
                      <Form.Control>
                        <Textarea {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
