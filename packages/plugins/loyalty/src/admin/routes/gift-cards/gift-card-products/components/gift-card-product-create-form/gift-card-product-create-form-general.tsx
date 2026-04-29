import { Input, Text, Textarea } from "@medusajs/ui";
import { UseFormReturn } from "react-hook-form";
import { Form } from "../../../../../components/form";
import { HandleInput } from "../../../../../components/handle-input";
import { ProductCreateSchemaType } from "./types";

type GiftCardProductCreateFormGeneralProps = {
  form: UseFormReturn<ProductCreateSchemaType>;
  children: React.ReactNode;
};

export const GiftCardProductCreateFormGeneral = ({
  form,
  children,
}: GiftCardProductCreateFormGeneralProps) => {
  return (
    <div
      id="general"
      className="grid grid-cols-1 gap-y-6 gap-x-4 md:grid-cols-2"
    >
      <div>
        <Text className="txt-small-plus text-ui-fg-base" weight="plus">
          General details
        </Text>
        <Text className="txt-small text-ui-fg-muted">
          Provide details about the gift card product
        </Text>
      </div>

      <div className="flex flex-col gap-y-4">
        <Form.Field
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="font-normal">Title</Form.Label>
                <Form.Control>
                  <Input {...field} placeholder="Medusa Gift Card" />
                </Form.Control>
              </Form.Item>
            );
          }}
        />

        <Form.Field
          control={form.control}
          name="subtitle"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="font-normal" optional>
                  Subtitle
                </Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    placeholder="Gift Card for your friends & family"
                  />
                </Form.Control>
              </Form.Item>
            );
          }}
        />

        <Form.Field
          control={form.control}
          name="handle"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="font-normal" optional>
                  Handle
                </Form.Label>
                <Form.Control>
                  <HandleInput {...field} placeholder="medusa-gift-card" />
                </Form.Control>
              </Form.Item>
            );
          }}
        />

        <Form.Field
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="font-normal" optional>
                  Description
                </Form.Label>
                <Form.Control>
                  <Textarea
                    {...field}
                    placeholder="Bring joy to your friends and family this holiday season with the Medusa Gift Card"
                  />
                </Form.Control>
              </Form.Item>
            );
          }}
        />

        {children}
      </div>
    </div>
  );
};
