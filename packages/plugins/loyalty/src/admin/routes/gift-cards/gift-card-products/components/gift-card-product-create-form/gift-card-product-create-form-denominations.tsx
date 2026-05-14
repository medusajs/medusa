import { XMark } from "@medusajs/icons";
import { Alert, Button, IconButton, Input, Text } from "@medusajs/ui";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Form } from "../../../../../components/form";
import { ProductCreateSchemaType } from "./types";

type GiftCardProductCreateFormDenominationsProps = {
  form: UseFormReturn<ProductCreateSchemaType>;
};

export const GiftCardProductCreateFormDenominations = ({
  form,
}: GiftCardProductCreateFormDenominationsProps) => {
  const {
    fields: denominationsFields,
    append: addDenomination,
    remove: removeDenomination,
  } = useFieldArray({
    name: "denominations",
    control: form.control,
  });

  return (
    <div
      id="variants"
      className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2"
    >
      <div>
        <Text className="txt-small-plus text-ui-fg-base" weight="plus">
          Denominations
        </Text>

        <Text className="txt-small text-ui-fg-muted">
          Denominations are the different values that can be selected for the
          gift card product.
        </Text>
      </div>

      <div className="flex flex-col gap-y-6">
        <div>
          <div className="flex flex-col gap-y-2">
            {denominationsFields.map((denominationField, index) => {
              return (
                <div
                  key={denominationField.id}
                  className="flex items-center justify-between shadow-elevation-card-rest bg-ui-bg-component transition-fg rounded-md px-4 py-2 gap-x-2"
                >
                  <Form.Field
                    key={denominationField.id}
                    control={form.control}
                    name={`denominations.${index}.value`}
                    render={({ field }) => {
                      return (
                        <Form.Item className="w-full">
                          <Form.Control>
                            <Input
                              {...field}
                              placeholder="100"
                              className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover shadow-borders-base"
                            />
                          </Form.Control>

                          <Form.ErrorMessage />
                        </Form.Item>
                      );
                    }}
                  />

                  <div className="flex items-center rounded-xl">
                    <IconButton
                      type="button"
                      size="small"
                      variant="transparent"
                      onClick={() => {
                        removeDenomination(index);
                      }}
                    >
                      <XMark />
                    </IconButton>
                  </div>
                </div>
              );
            })}

            <Button
              size="small"
              variant="secondary"
              type="button"
              className="w-full"
              onClick={() => {
                addDenomination({ value: "", prices: {} });
              }}
            >
              Add denomination
            </Button>

            {form.formState.errors.denominations && (
              <Alert variant="error">
                Please add at least one denomination.
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
