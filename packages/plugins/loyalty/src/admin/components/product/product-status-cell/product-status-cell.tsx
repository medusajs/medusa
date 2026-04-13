import { HttpTypes } from "@medusajs/types";
import { StatusBadge } from "@medusajs/ui";

type ProductStatusCellProps = {
  status: HttpTypes.AdminProductStatus;
};

export const ProductStatusCell = ({ status }: ProductStatusCellProps) => {
  const [color, text] = {
    draft: ["grey", "Draft"],
    proposed: ["orange", "Proposed"],
    published: ["green", "Published"],
    rejected: ["red", "Rejected"],
  }[status] as ["grey" | "orange" | "green" | "red", string];

  return <StatusBadge color={color}>{text}</StatusBadge>;
};

export const ProductStatusHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span>Status</span>
    </div>
  );
};
