import { Store } from "@medusajs/medusa"
import { Button, Drawer, Heading, Select } from "@medusajs/ui"
import { useAdminUpdateStore } from "medusa-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../components/common/form"

const EditCurrenciesDetailsSchema = zod.object({
  default_currency_code: zod.string(),
})

type EditCurrenciesDetailsDrawerProps = {
  store: Store
}

export const EditCurrenciesDetailsDrawer = ({
  store,
}: EditCurrenciesDetailsDrawerProps) => {
  const [open, setOpen] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  const { t } = useTranslation()

  const { mutateAsync } = useAdminUpdateStore()

  const form = useForm<zod.infer<typeof EditCurrenciesDetailsSchema>>({
    defaultValues: {
      default_currency_code: store.default_currency_code,
    },
  })

  const sortedCurrencies = store.currencies.sort((a, b) => {
    if (a.code === store.default_currency_code) {
      return -1
    }

    if (b.code === store.default_currency_code) {
      return 1
    }

    return a.code.localeCompare(b.code)
  })

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()

      /**
       * We need to close the select when the drawer closes.
       * Otherwise it may lead to `pointer-events: none` being applied to the body.
       */
      setSelectOpen(false)
    }
    setOpen(open)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        default_currency_code: values.default_currency_code,
      },
      {
        onSuccess: ({ store }) => {
          form.reset({
            default_currency_code: store.default_currency_code,
          })

          onOpenChange(false)
        },
        onError: (err) => {
          console.log(err)
        },
      }
    )
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>
        <Button variant="secondary">
          {t("currencies.editCurrencyDetails")}
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("currencies.editCurrencyDetails")}</Heading>
        </Drawer.Header>
        <Drawer.Body>
          <Form {...form}>
            <form>
              <Form.Field
                name="default_currency_code"
                control={form.control}
                render={({ field: { ref, ...field } }) => {
                  return (
                    <Form.Item className="gap-y-2">
                      <Form.Label>{t("currencies.defaultCurrency")}</Form.Label>
                      <div>
                        <Form.Control>
                          <Select
                            {...field}
                            open={selectOpen}
                            onOpenChange={setSelectOpen}
                            value={field.value}
                            onValueChange={field.onChange}
                            size="small"
                          >
                            <Select.Trigger ref={ref}>
                              <Select.Value>
                                <span>
                                  <span className="txt-compact-small-plus uppercase">
                                    {field.value}
                                  </span>{" "}
                                  {
                                    sortedCurrencies.find(
                                      (curr) => curr.code === field.value
                                    )?.name
                                  }
                                </span>
                              </Select.Value>
                            </Select.Trigger>
                            <Select.Content>
                              {sortedCurrencies.map((curr) => (
                                <Select.Item key={curr.code} value={curr.code}>
                                  <span>
                                    <span className="txt-compact-small-plus uppercase">
                                      {curr.code}
                                    </span>{" "}
                                    {curr.name}
                                  </span>
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
                        </Form.Control>
                        <Form.ErrorMessage />
                      </div>
                      <Form.Hint>
                        {t("currencies.defaultCurrencyHint")}
                      </Form.Hint>
                    </Form.Item>
                  )
                }}
              />
            </form>
          </Form>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">{t("general.cancel")}</Button>
          </Drawer.Close>
          <Button onClick={onSubmit}>{t("general.save")}</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
