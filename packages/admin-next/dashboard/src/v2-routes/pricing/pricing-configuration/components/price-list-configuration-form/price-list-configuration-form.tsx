import { zodResolver } from "@hookform/resolvers/zod"
import { PriceListDTO } from "@medusajs/types"
import { Button, DatePicker, Switch, Text } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdatePriceList } from "../../../../../hooks/api/price-lists"

type PriceListConfigurationFormProps = {
  priceList: PriceListDTO
}

const PriceListConfigurationSchema = z.object({
  ends_at: z.date().nullable(),
  starts_at: z.date().nullable(),
})

/**
 * TODO: Add CustomerGroups and possibly change to a RouteFocusModal
 *
 * Customer group rules aren't supported out of the box atm, so we can't
 * set them in the UI without throwing an error.
 */

export const PriceListConfigurationForm = ({
  priceList,
}: PriceListConfigurationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof PriceListConfigurationSchema>>({
    defaultValues: {
      ends_at: priceList.ends_at ? new Date(priceList.ends_at) : null,
      starts_at: priceList.starts_at ? new Date(priceList.starts_at) : null,
    },
    resolver: zodResolver(PriceListConfigurationSchema),
  })

  const { mutateAsync } = useUpdatePriceList(priceList.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      // @ts-ignore - type is wrong and expects an ID.
      {
        starts_at: values.starts_at?.toISOString() || null,
        ends_at: values.ends_at?.toISOString() || null,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <Form.Field
            control={form.control}
            name="starts_at"
            render={({ field: { value, onChange, ...rest } }) => {
              const handleSwitchChange = (checked: boolean) => {
                if (!checked) {
                  onChange(null)
                  return
                }

                const now = new Date()

                onChange(now)
              }

              return (
                <Form.Item>
                  <Collapsible.Root
                    open={!!value}
                    onOpenChange={handleSwitchChange}
                  >
                    <div className="grid grid-cols-[1fr_32px] gap-4">
                      <div>
                        <Text size="small" leading="compact" weight="plus">
                          {t("pricing.fields.startDateLabel")}
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          {t("pricing.fields.startDateHint")}
                        </Text>
                      </div>
                      <Collapsible.Trigger asChild>
                        <Switch name={rest.name} checked={!!value} />
                      </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-y-2 pt-4">
                        <Form.Label className="!txt-small text-ui-fg-subtle">
                          {t("fields.startDate")}
                        </Form.Label>
                        <Form.Control>
                          <DatePicker
                            value={value || undefined}
                            onChange={onChange}
                            {...rest}
                          />
                        </Form.Control>
                      </div>
                    </Collapsible.Content>
                    <Form.ErrorMessage />
                  </Collapsible.Root>
                </Form.Item>
              )
            }}
          />
          <Divider />
          <Form.Field
            control={form.control}
            name="ends_at"
            render={({ field: { value, onChange, ...rest } }) => {
              const handleSwitchChange = (checked: boolean) => {
                if (!checked) {
                  onChange(null)
                  return
                }

                const inAWeek = new Date(
                  new Date().setDate(new Date().getDate() + 7)
                )

                onChange(inAWeek)
              }

              return (
                <Form.Item>
                  <Collapsible.Root
                    open={!!value}
                    onOpenChange={handleSwitchChange}
                  >
                    <div className="grid grid-cols-[1fr_32px] gap-4">
                      <div>
                        <Text size="small" leading="compact" weight="plus">
                          {t("pricing.fields.endDateLabel")}
                        </Text>
                        <Text size="small" className="text-ui-fg-subtle">
                          {t("pricing.fields.endDateHint")}
                        </Text>
                      </div>
                      <Collapsible.Trigger asChild>
                        <Switch name={rest.name} checked={!!value} />
                      </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                      <div className="flex flex-col gap-y-2 pt-4">
                        <Form.Label className="!txt-small text-ui-fg-subtle">
                          {t("fields.endDate")}
                        </Form.Label>
                        <Form.Control>
                          <DatePicker
                            value={value || undefined}
                            onChange={onChange}
                            {...rest}
                          />
                        </Form.Control>
                      </div>
                    </Collapsible.Content>
                    <Form.ErrorMessage />
                  </Collapsible.Root>
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer className="shrink-0">
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
