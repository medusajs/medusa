import { Customer } from "@medusajs/medusa"
import { Checkbox, Heading, Input, Label } from "@medusajs/ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import { debounce } from "lodash"
import { useMedusa } from "medusa-react"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { json } from "react-router-dom"

import { Combobox } from "../../../../../../components/common/combobox"
import { Form } from "../../../../../../components/common/form"
import { useCreateDraftOrder } from "../hooks"

export const CreateDraftOrderCustomerDetails = () => {
  const [useExistingCustomer, setUseExistingCustomer] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const { t } = useTranslation()
  const { form, setCustomer } = useCreateDraftOrder()

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
    ["customers", debouncedQuery],
    async ({ pageParam = 0 }) => {
      const res = await client.admin.customers.list({
        q: debouncedQuery,
        limit: 10,
        offset: pageParam,
        has_account: true, // Only show customers with confirmed accounts
      })
      return res
    },
    {
      getNextPageParam: (lastPage) => {
        const moreCustomersExist =
          lastPage.count > lastPage.offset + lastPage.limit
        return moreCustomersExist ? lastPage.offset + lastPage.limit : undefined
      },
      keepPreviousData: true,
    }
  )

  const createLabel = (customer?: Customer) => {
    if (!customer) {
      return ""
    }

    const { first_name, last_name, email } = customer

    const name = [first_name, last_name].filter(Boolean).join(" ")

    if (name) {
      return `${name} (${email})`
    }

    return email
  }

  const handleCustomerChange = (cusId: string | undefined) => {
    if (!cusId) {
      setCustomer(null)
      return
    }

    const customer = data?.pages
      .flatMap((page) => page.customers)
      .find((c) => c.id === cusId)

    if (!customer) {
      throw json({ message: "Customer not found" }, 400)
    }

    form.setValue("email", customer.email, {
      shouldDirty: true,
      shouldTouch: true,
    })
    setCustomer(customer)
  }

  const options =
    data?.pages.flatMap((page) =>
      page.customers.map((c) => ({ label: createLabel(c), value: c.id }))
    ) ?? []

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2">{t("fields.customer")}</Heading>
      <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {useExistingCustomer ? (
          <Form.Field
            key="customer-input"
            control={form.control}
            name="customer_id"
            render={({ field: { onChange, ...field } }) => {
              return (
                <Form.Item>
                  <Form.Label className="text-ui-fg-subtle !font-normal">
                    {t("fields.customer")}
                  </Form.Label>
                  <Form.Control>
                    <Combobox
                      {...field}
                      onChange={(val) => {
                        onChange(val)
                        handleCustomerChange(val)
                      }}
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
              )
            }}
          />
        ) : (
          <Form.Field
            key="email-input"
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label className="text-ui-fg-subtle !font-normal">
                    {t("fields.email")}
                  </Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        )}
      </fieldset>
      <Label className="flex w-fit items-center gap-x-2">
        <Checkbox
          checked={useExistingCustomer}
          onCheckedChange={(val) => setUseExistingCustomer(!!val)}
        />
        <span>{t("draftOrders.create.useExistingCustomerLabel")}</span>
      </Label>
    </div>
  )
}
