import { ShippingOptionDTO } from "@medusajs/types"
import { Button, Input, RadioGroup, Select, Switch, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useFulfillmentProviders } from "../../../../../hooks/api/fulfillment-providers"
import { useUpdateShippingOptions } from "../../../../../hooks/api/shipping-options"
import { useShippingProfiles } from "../../../../../hooks/api/shipping-profiles"
import { pick } from "../../../../../lib/common"
import { formatProvider } from "../../../../../lib/format-provider"
import { isOptionEnabledInStore } from "../../../../../lib/shipping-options"

enum ShippingAllocation {
  FlatRate = "flat",
  Calculated = "calculated",
}

type EditShippingOptionFormProps = {
  isReturn?: boolean
  shippingOption: ShippingOptionDTO
}

const EditShippingOptionSchema = zod.object({
  name: zod.string().min(1),
  price_type: zod.nativeEnum(ShippingAllocation),
  enabled_in_store: zod.boolean().optional(),
  shipping_profile_id: zod.string(),
  provider_id: zod.string(),
})

export const EditShippingOptionForm = ({
  shippingOption,
  isReturn,
}: EditShippingOptionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { shipping_profiles: shippingProfiles } = useShippingProfiles({
    limit: 999,
  })

  const { fulfillment_providers = [] } = useFulfillmentProviders({
    is_enabled: true,
  })

  const form = useForm<zod.infer<typeof EditShippingOptionSchema>>({
    defaultValues: {
      name: shippingOption.name,
      price_type: shippingOption.price_type as ShippingAllocation,
      enabled_in_store: isOptionEnabledInStore(shippingOption),
      shipping_profile_id: shippingOption.shipping_profile_id,
      provider_id: shippingOption.provider_id,
    },
  })

  const { mutateAsync, isPending: isLoading } = useUpdateShippingOptions(
    shippingOption.id
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    const rules = shippingOption.rules.map((r) => ({
      ...pick(r, ["id", "attribute", "operator", "value"]),
    }))

    const storeRule = rules.find((r) => r.attribute === "enabled_in_store")
    if (!storeRule) {
      // NOTE: should always exist sice we always create this rule when we create a shipping option
      rules.push({
        value: values.enabled_in_store ? "true" : "false",
        attribute: "enabled_in_store",
        operator: "eq",
      })
    } else {
      storeRule.value = values.enabled_in_store ? "true" : "false"
    }

    await mutateAsync(
      {
        name: values.name,
        price_type: values.price_type,
        shipping_profile_id: values.shipping_profile_id,
        provider_id: values.provider_id,
        rules,
      },
      {
        onSuccess: () => {
          toast.success(t("general.success"), {
            dismissLabel: t("actions.close"),
          })
          handleSuccess()
        },
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-8">
              <Form.Field
                control={form.control}
                name="price_type"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("location.shippingOptions.create.allocation")}
                      </Form.Label>
                      <Form.Control>
                        <RadioGroup {...field} onValueChange={field.onChange}>
                          <RadioGroup.ChoiceBox
                            className="flex-1"
                            value={ShippingAllocation.FlatRate}
                            label={t("location.shippingOptions.create.fixed")}
                            description={t(
                              "location.shippingOptions.create.fixedDescription"
                            )}
                          />
                          <RadioGroup.ChoiceBox
                            className="flex-1"
                            value={ShippingAllocation.Calculated}
                            label={t(
                              "location.shippingOptions.create.calculated"
                            )}
                            description={t(
                              "location.shippingOptions.create.calculatedDescription"
                            )}
                          />
                        </RadioGroup>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <div className="grid gap-y-8 divide-y">
                <div className="grid gap-y-4">
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

                  <Form.Field
                    control={form.control}
                    name="shipping_profile_id"
                    render={({ field: { onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t("location.shippingOptions.create.profile")}
                          </Form.Label>
                          <Form.Control>
                            <Select {...field} onValueChange={onChange}>
                              <Select.Trigger ref={field.ref}>
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                {(shippingProfiles ?? []).map((profile) => (
                                  <Select.Item
                                    key={profile.id}
                                    value={profile.id}
                                  >
                                    {profile.name}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="provider_id"
                    render={({ field: { onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t("location.shippingOptions.edit.provider")}
                          </Form.Label>
                          <Form.Control>
                            <Select {...field} onValueChange={onChange}>
                              <Select.Trigger ref={field.ref}>
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                {fulfillment_providers.map((provider) => (
                                  <Select.Item
                                    key={provider.id}
                                    value={provider.id}
                                  >
                                    {formatProvider(provider.id)}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>

                <div className="pt-6">
                  <Form.Field
                    control={form.control}
                    name="enabled_in_store"
                    render={({ field: { value, onChange, ...field } }) => (
                      <Form.Item>
                        <div className="flex items-center justify-between">
                          <Form.Label>
                            {t("location.shippingOptions.create.enable")}
                          </Form.Label>
                          <Form.Control>
                            <Switch
                              {...field}
                              checked={!!value}
                              onCheckedChange={onChange}
                            />
                          </Form.Control>
                        </div>
                        <Form.Hint className="!mt-1">
                          {t(
                            "shipping.shippingOptions.create.enableDescription"
                          )}
                        </Form.Hint>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
