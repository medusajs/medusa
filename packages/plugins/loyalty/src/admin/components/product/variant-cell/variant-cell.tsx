import { HttpTypes } from "@medusajs/types";
import { PlaceholderCell } from "../../placeholder-cell";

type VariantCellProps = {
  variants?: HttpTypes.AdminProductVariant[] | null;
};

export const VariantCell = ({ variants }: VariantCellProps) => {
  if (!variants || !variants.length) {
    return <PlaceholderCell />;
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">
        {`${variants.length} denomination${variants.length > 1 ? "s" : ""}`}
      </span>
    </div>
  );
};

export const VariantHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span>Denominations</span>
    </div>
  );
};
