import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, RadioGroup, Text, clx } from "@medusajs/ui"
import { useAdminCreateShippingOption } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteFocusModal } from "../../../../../components/route-modal"

enum ShippingOptionPriceType {
  FLAT_RATE = "flat_rate",
  CALCULATED = "calculated",
}

enum ShippingOptionType {
  OUTBOUND = "outbound",
  RETURN = "return",
}

const CreateShippingOptionSchema = zod.object({
  name: zod.string().min(1),
  type: zod.nativeEnum(ShippingOptionType),
  store_option: zod.boolean(),
  provider_id: zod.string(),
  price_type: zod.nativeEnum(ShippingOptionPriceType),
})

export const CreateShippingOptionForm = () => {
  const { id: regionId } = useParams()
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof CreateShippingOptionSchema>>({
    defaultValues: {
      name: "",
      type: ShippingOptionType.OUTBOUND,
      store_option: false,
      provider_id: "",
      price_type: ShippingOptionPriceType.FLAT_RATE,
    },
    resolver: zodResolver(CreateShippingOptionSchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateShippingOption()

  const handleSubmit = form.handleSubmit(async (values) => {
    const { type, store_option, ...rest } = values

    await mutateAsync({
      region_id: regionId!,
      data: {},
      is_return: type === ShippingOptionType.RETURN,
      admin_only: !store_option,
      ...rest,
    })
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
        <RouteFocusModal.Body>
          <div
            className={clx(
              "flex h-full w-full flex-col items-center overflow-y-auto p-16"
            )}
            id="form-section"
          >
            <div className="flex w-full max-w-[720px] flex-col gap-y-8">
              <div>
                <Heading>{t("regions.createRegion")}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("regions.createRegionHint")}
                </Text>
              </div>
              <div>
                <Form.Field
                  control={form.control}
                  name="type"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Control>
                          <RadioGroup
                            {...field}
                            onValueChange={field.onChange}
                            className="grid grid-cols-1 gap-4 md:grid-cols-2"
                          >
                            <RadioGroup.ChoiceBox
                              value={ShippingOptionType.OUTBOUND}
                              label={"Outbound"}
                              description="Use this if you are creating a shipping option for outbound orders."
                            />
                            <RadioGroup.ChoiceBox
                              value={ShippingOptionType.RETURN}
                              label={"Return"}
                              description="Use this if you are creating a shipping option for return orders."
                            />
                          </RadioGroup>
                        </Form.Control>
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Field
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.name")}</Form.Label>
                          <Form.Control>
                            <Input {...field} />
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
      </form>
    </RouteFocusModal.Form>
  )
}
