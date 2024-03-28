import { useInfiniteQuery } from "@tanstack/react-query"
import debounce from "lodash/debounce"
import { useMedusa } from "medusa-react"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { ShippingOption } from "@medusajs/medusa"
import { CurrencyInput, Heading, Input } from "@medusajs/ui"
import { json } from "react-router-dom"
import { Combobox } from "../../../../../../components/common/combobox"
import { ConditionalTooltip } from "../../../../../../components/common/conditional-tooltip"
import { Form } from "../../../../../../components/common/form"
import { getLocaleAmount } from "../../../../../../lib/money-amount-helpers"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderShippingMethodDetails = () => {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const { t } = useTranslation()
  const { form, region } = useCreateDraftOrder()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((query) => setDebouncedQuery(query), 300),
    []
  )

  useEffect(() => {
    debouncedUpdate(query)

    return () => debouncedUpdate.cancel()
  }, [query, debouncedUpdate])

  const { client } = useMedusa()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["shipping_options", region?.id, debouncedQuery],
    async ({ pageParam = 0 }) => {
      const res = await client.admin.shippingOptions.list({
        q: debouncedQuery || undefined,
        limit: 10,
        offset: pageParam,
        is_return: false,
        region_id: region?.id,
      })
      return res
    },
    {
      getNextPageParam: (lastPage) => {
        const moreCustomersExist =
          lastPage.count > lastPage.offset + lastPage.limit
        return moreCustomersExist ? lastPage.offset + lastPage.limit : undefined
      },
      enabled: !!region?.id,
      keepPreviousData: true,
    }
  )

  const createLabel = (shippingOption?: ShippingOption) => {
    if (!shippingOption) {
      return ""
    }

    return `${shippingOption.name} - ${getLocaleAmount(
      shippingOption.amount || 0,
      region?.currency_code!
    )}`
  }

  const options =
    data?.pages
      .flatMap((page) => page.shipping_options)
      .map((so) => ({
        label: createLabel(so),
        value: so.id,
      })) || []

  const handleShippingMethodChange = (optionId: string | undefined) => {
    if (!optionId) {
      return
    }

    const option = data?.pages
      .flatMap((page) => page.shipping_options)
      .find((so) => so.id === optionId)

    if (!option) {
      throw json({ message: "Shipping option not found" }, 400)
    }

    form.setValue("shipping_method.option_title", option.name, {
      shouldDirty: true,
      shouldTouch: true,
    })
    form.setValue("shipping_method.amount", option.amount || 0, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2">{t("fields.shipping")}</Heading>
      <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={form.control}
          name="shipping_method.option_id"
          render={({ field: { onChange, disabled, ...field } }) => {
            return (
              <ConditionalTooltip
                showTooltip={!region}
                content={t("draftOrders.create.chooseRegionTooltip")}
              >
                <Form.Item>
                  <div>
                    <Form.Label>
                      {t("draftOrders.create.shippingOptionLabel")}
                    </Form.Label>
                    <Form.Hint>
                      {t("draftOrders.create.shippingOptionHint")}
                    </Form.Hint>
                  </div>
                  <Form.Control>
                    <Combobox
                      {...field}
                      onChange={(val) => {
                        handleShippingMethodChange(val)
                        onChange(val)
                      }}
                      disabled={!region || disabled}
                      searchValue={query}
                      onSearchValueChange={setQuery}
                      fetchNextPage={fetchNextPage}
                      isFetchingNextPage={isFetchingNextPage}
                      options={options}
                      autoComplete="false"
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              </ConditionalTooltip>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="shipping_method.custom_amount"
          render={({ field: { onChange, ...field } }) => {
            return (
              <ConditionalTooltip
                showTooltip={!region}
                content={t("draftOrders.create.chooseRegionTooltip")}
              >
                <Form.Item>
                  <div>
                    <Form.Label optional>
                      {t("draftOrders.create.shippingPriceOverrideLabel")}
                    </Form.Label>
                    <Form.Hint>
                      {t("draftOrders.create.shippingPriceOverrideHint")}
                    </Form.Hint>
                  </div>
                  <Form.Control>
                    {region ? (
                      <CurrencyInput
                        {...field}
                        onValueChange={onChange}
                        code={region.currency.code}
                        symbol={region.currency.symbol_native}
                      />
                    ) : (
                      <Input disabled />
                    )}
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              </ConditionalTooltip>
            )
          }}
        />
      </fieldset>
    </div>
  )
}
