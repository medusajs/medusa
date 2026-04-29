import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/framework/types"
import {
  Button,
  CurrencyInput,
  DatePicker,
  Divider,
  Heading,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "@medusajs/framework/zod"
import { Combobox } from "../../../../components/combobox"
import { Form } from "../../../../components/form"
import { RouteFocusModal, useRouteModal } from "../../../../components/modals"
import { useCreateGiftCard } from "../../../../hooks/api/gift-cards"
import { currencies } from "../../../../lib/currencies"
import { GiftCardCreateSchema } from "./schema"

export const GiftCardCreateForm = ({
  store,
}: {
  store: HttpTypes.AdminStore
}) => {
  const { handleSuccess } = useRouteModal()
  const supportedCurrencies = store.supported_currencies.map(
    (currency) => currency.currency_code
  )

  const form = useForm<z.infer<typeof GiftCardCreateSchema>>({
    defaultValues: {
      value: undefined,
      currency_code: supportedCurrencies?.[0] ?? "eur",
      expires_at: null,
      metadata: {},
      note: "",
    },
    resolver: zodResolver(GiftCardCreateSchema),
  })

  const { mutateAsync: createGiftCard, isPending } = useCreateGiftCard()

  const handleSubmit = form.handleSubmit(async (data) => {
    await createGiftCard(data, {
      onSuccess: (data) => {
        toast.success("Gift card was successfully created")
        handleSuccess(`../${data.gift_card.id}`)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  // Set up currency options
  const [currencySearchValue, setCurrencySearchValue] = useState("")

  const currencyOptions = useMemo(() => {
    const options = Object.values(currencies).map((currency) => ({
      label: `${currency.code} - ${currency.name} (${currency.symbol_native})`,
      value: currency.code.toLowerCase(),
    }))

    if (!currencySearchValue) {
      return options
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(currencySearchValue.toLowerCase())
    )
  }, [currencySearchValue])

  const selectedCurrency = form.watch("currency_code")
  const currentCurrency = useMemo(() => {
    return currencies[selectedCurrency.toUpperCase()]
  }, [selectedCurrency, currencies])

  if (!currentCurrency) {
    return <div>Loading...</div>
  }

  return (
    <RouteFocusModal.Form form={form}>
      <RouteFocusModal.Header>
        <div className="-my-2 w-full border-l"></div>
      </RouteFocusModal.Header>

      <RouteFocusModal.Body className="size-full overflow-hidden">
        <div className="flex flex-col items-center p-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div className="flex flex-col">
              <Heading level="h1">Create Gift Card</Heading>

              <Text className="text-ui-fg-subtle" size="small">
                Create a new gift card
              </Text>
            </div>

            <Divider variant="dashed" />

            <div
              id="general"
              className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2"
            >
              <div>
                <Text className="txt-small-plus text-ui-fg-base" weight="plus">
                  General details
                </Text>
                <Text className="txt-small text-ui-fg-muted">
                  Provide details about the gift card
                </Text>
              </div>

              <div className="flex flex-col gap-y-4">
                <Form.Field
                  control={form.control}
                  name="currency_code"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-full">
                        <Form.Label className="font-normal">
                          Currency
                        </Form.Label>

                        <Form.Control>
                          <Combobox
                            value={field.value}
                            onChange={field.onChange}
                            searchValue={currencySearchValue}
                            onSearchValueChange={setCurrencySearchValue}
                            options={currencyOptions}
                            placeholder="Search for a currency..."
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />

                <Form.Field
                  control={form.control}
                  name="value"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-full">
                        <Form.Label className="font-normal">Value</Form.Label>
                        <Form.Control>
                          <CurrencyInput
                            value={field.value}
                            code={currentCurrency.code}
                            symbol={currentCurrency.symbol_native}
                            decimalScale={currentCurrency.decimal_digits}
                            decimalsLimit={currentCurrency.decimal_digits}
                            allowDecimals={true}
                            formatValueOnBlur={true}
                            allowNegativeValue={false}
                            autoComplete="off"
                            tabIndex={-1}
                            onValueChange={(_value, _name, values) => {
                              field.onChange(values?.value ? values?.value : "")
                            }}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />

                <Form.Field
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Expires at</Form.Label>

                        <Form.Control>
                          <DatePicker
                            hourCycle={24}
                            granularity="minute"
                            shouldCloseOnSelect={false}
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
                  name="note"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-full">
                        <Form.Label className="font-normal">Note</Form.Label>
                        <Form.Control>
                          <Textarea
                            placeholder="Add a note about this gift card"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </RouteFocusModal.Body>

      <RouteFocusModal.Footer>
        <RouteFocusModal.Close asChild disabled={isPending}>
          <Button variant="secondary" size="small" disabled={isPending}>
            Cancel
          </Button>
        </RouteFocusModal.Close>

        <Button
          variant="primary"
          size="small"
          onClick={handleSubmit}
          disabled={isPending}
        >
          Create
        </Button>
      </RouteFocusModal.Footer>
    </RouteFocusModal.Form>
  )
}
