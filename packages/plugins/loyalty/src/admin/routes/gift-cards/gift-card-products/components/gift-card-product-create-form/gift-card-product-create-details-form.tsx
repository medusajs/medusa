import { Divider, Heading } from "@medusajs/ui";
import { UseFormReturn } from "react-hook-form";
import { GiftCardProductCreateFormDenominations } from "./gift-card-product-create-form-denominations";
import { GiftCardProductCreateFormGeneral } from "./gift-card-product-create-form-general";
import { GiftCardProductCreateFormMedia } from "./gift-card-product-create-form-media";
import { GiftCardProductCreateOrganizeForm } from "./gift-card-product-create-form-organize";
import { ProductCreateSchemaType } from "./types";

type GiftCardProductCreateDetailsFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>;
};

export const GiftCardProductCreateDetailsForm = ({
  form,
}: GiftCardProductCreateDetailsFormProps) => {
  return (
    <div className="flex flex-col items-center p-16">
      <div className="flex w-full max-w-[720px] flex-col gap-y-8">
        <Header />
        <Divider variant="dashed" />
        <div className="flex flex-col gap-y-8">
          <GiftCardProductCreateFormGeneral form={form}>
            <GiftCardProductCreateFormMedia form={form} />
          </GiftCardProductCreateFormGeneral>

          <Divider variant="dashed" />
          <GiftCardProductCreateOrganizeForm form={form} />

          <Divider variant="dashed" />
          <GiftCardProductCreateFormDenominations form={form} />
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="flex flex-col">
      <Heading>Create Gift Card Product</Heading>
    </div>
  );
};
