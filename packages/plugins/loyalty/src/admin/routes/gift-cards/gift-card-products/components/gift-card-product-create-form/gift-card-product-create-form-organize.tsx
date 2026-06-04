import { UseFormReturn } from "react-hook-form";
import { StackedFocusModal } from "../../../../../components/modals";
import { GiftCardProductCreateOrganizationSection } from "./gift-card-product-create-form-organize-section";
import { GiftCardProductSalesChannelStackedModal } from "./gift-card-product-sales-channel-stacked-modal";
import { SC_STACKED_MODAL_ID } from "./schema";
import { ProductCreateSchemaType } from "./types";

type GiftCardProductCreateOrganizeFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>;
};

export const GiftCardProductCreateOrganizeForm = ({
  form,
}: GiftCardProductCreateOrganizeFormProps) => {
  return (
    <StackedFocusModal id={SC_STACKED_MODAL_ID}>
      <GiftCardProductCreateOrganizationSection form={form} />

      <GiftCardProductSalesChannelStackedModal form={form} />
    </StackedFocusModal>
  );
};
