import { HttpTypes } from "@medusajs/types";
import { Thumbnail } from "../../thumbnail";

type ProductCellProps = {
  product: Pick<HttpTypes.AdminProduct, "thumbnail" | "title">;
};

export const ProductCell = ({ product }: ProductCellProps) => {
  return (
    <div className="flex h-full w-full max-w-[250px] items-center gap-x-3 overflow-hidden">
      <div className="w-fit flex-shrink-0">
        <Thumbnail src={product.thumbnail} />
      </div>
      <span title={product.title} className="truncate">
        {product.title}
      </span>
    </div>
  );
};

export const ProductHeader = () => {
  return (
    <div className="flex h-full w-full items-center">
      <span>Product</span>
    </div>
  );
};
