import { Button, Text } from "@medusajs/ui";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Form } from "../../../../../components/form";
import { IconAvatar } from "../../../../../components/icon-avatar";
import { ChannelIcon } from "../../../../../components/icons/channel-icon";
import { Listicle } from "../../../../../components/listicle";
import { StackedFocusModal } from "../../../../../components/modals";
import { useSalesChannels } from "../../../../../hooks/api/sales-channels";
import { ProductCreateSchemaType } from "./types";

type GiftCardProductCreateOrganizationSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>;
};

export const GiftCardProductCreateOrganizationSection = ({
  form,
}: GiftCardProductCreateOrganizationSectionProps) => {
  const { count } = useSalesChannels();
  const { fields } = useFieldArray({
    control: form.control,
    name: "sales_channels",
    keyName: "key",
  });

  return (
    <div
      id="organize"
      className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2"
    >
      <div>
        <Text className="txt-small-plus text-ui-fg-base" weight="plus">
          Sales Channel(s)
        </Text>
        <Text className="txt-small text-ui-fg-muted">
          The product will only be available in the default sales channel if
          left untouched
        </Text>
      </div>

      <div className="flex flex-col gap-y-4">
        <Form.Field
          control={form.control}
          name="sales_channels"
          render={() => {
            return (
              <Form.Item>
                <Form.Control className="mt-0">
                  {
                    <Listicle
                      labelKey={fields[0]?.name ?? "Not Configured"}
                      descriptionKey={`Available in ${fields.length} out of ${count}`}
                      icon={
                        <IconAvatar
                          size="small"
                          className="shadow-borders-base bg-ui-bg-base"
                        >
                          <ChannelIcon />
                        </IconAvatar>
                      }
                    >
                      <StackedFocusModal.Trigger asChild>
                        <Button
                          size="small"
                          variant="secondary"
                          type="button"
                          className="px-2 py-1"
                        >
                          Edit
                        </Button>
                      </StackedFocusModal.Trigger>
                    </Listicle>
                  }
                </Form.Control>
              </Form.Item>
            );
          }}
        />
      </div>
    </div>
  );
};
