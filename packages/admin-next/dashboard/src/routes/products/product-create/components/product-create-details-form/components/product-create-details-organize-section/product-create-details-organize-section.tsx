import { Button, Heading, Switch } from "@medusajs/ui"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"

import { ChipGroup } from "../../../../../../../components/common/chip-group"
import { Form } from "../../../../../../../components/common/form"
import { Combobox } from "../../../../../../../components/inputs/combobox"
import { useComboboxData } from "../../../../../../../hooks/use-combobox-data"
import { client } from "../../../../../../../lib/client"
import { CategoryCombobox } from "../../../../../common/components/category-combobox"
import { ProductCreateSchemaType } from "../../../../types"
import { useProductCreateDetailsContext } from "../product-create-details-context"

type ProductCreateOrganizationSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateOrganizationSection = ({
  form,
}: ProductCreateOrganizationSectionProps) => {
  const { t } = useTranslation()
  const { onOpenChange } = useProductCreateDetailsContext()

  const collections = useComboboxData({
    queryKey: ["product_collections"],
    queryFn: client.collections.list,
    getOptions: (data) =>
      data.collections.map((collection) => ({
        label: collection.title,
        value: collection.id,
      })),
  })

  const types = useComboboxData({
    queryKey: ["product_types"],
    queryFn: client.productTypes.list,
    getOptions: (data) =>
      data.product_types.map((type) => ({
        label: type.value,
        value: type.id,
      })),
  })

  const { fields, remove, replace } = useFieldArray({
    control: form.control,
    name: "sales_channels",
    keyName: "key",
  })

  const handleClearAllSalesChannels = () => {
    replace([])
  }

  return (
    <div id="organize" className="flex flex-col gap-y-8">
      <Heading level="h2">{t("products.organization")}</Heading>
      <div className="grid grid-cols-1 gap-x-4">
        <Form.Field
          control={form.control}
          name="discountable"
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <Form.Item>
                <div className="flex items-center justify-between">
                  <Form.Label optional>
                    {t("products.fields.discountable.label")}
                  </Form.Label>
                  <Form.Control>
                    <Switch
                      {...field}
                      checked={!!value}
                      onCheckedChange={onChange}
                    />
                  </Form.Control>
                </div>
              </Form.Item>
            )
          }}
        />
        <Form.Hint>
          <Trans i18nKey={"products.fields.discountable.hint"} />
        </Form.Hint>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <Form.Field
          control={form.control}
          name="type_id"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.type.label")}
                </Form.Label>
                <Form.Control>
                  <Combobox
                    {...field}
                    options={types.options}
                    searchValue={types.searchValue}
                    onSearchValueChange={types.onSearchValueChange}
                  />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={form.control}
          name="collection_id"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.collection.label")}
                </Form.Label>
                <Form.Control>
                  <Combobox
                    {...field}
                    options={collections.options}
                    searchValue={collections.searchValue}
                    onSearchValueChange={collections.onSearchValueChange}
                  />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <Form.Field
          control={form.control}
          name="categories"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional>
                  {t("products.fields.categories.label")}
                </Form.Label>
                <Form.Control>
                  <CategoryCombobox {...field} />
                </Form.Control>
              </Form.Item>
            )
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-y-4">
        <Form.Field
          control={form.control}
          name="sales_channels"
          render={() => {
            return (
              <Form.Item>
                <div className="flex items-start justify-between gap-x-4">
                  <div>
                    <Form.Label optional>
                      {t("products.fields.sales_channels.label")}
                    </Form.Label>
                    <Form.Hint>
                      <Trans i18nKey={"products.fields.sales_channels.hint"} />
                    </Form.Hint>
                  </div>
                  <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    onClick={() => onOpenChange(true)}
                  >
                    {t("actions.add")}
                  </Button>
                </div>
                <Form.Control className="mt-0">
                  {fields.length > 0 && (
                    <ChipGroup
                      onClearAll={handleClearAllSalesChannels}
                      onRemove={remove}
                      className="py-4"
                    >
                      {fields.map((field, index) => (
                        <ChipGroup.Chip key={field.key} index={index}>
                          {field.name}
                        </ChipGroup.Chip>
                      ))}
                    </ChipGroup>
                  )}
                </Form.Control>
              </Form.Item>
            )
          }}
        />
      </div>
    </div>
  )
}
