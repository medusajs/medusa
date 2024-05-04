import { LinkWorkflowInput } from "../../common";
import { CreateProductCategoryDTO, UpdateProductCategoryDTO } from "../../product";
export interface CreateProductCategoryWorkflowInput {
    product_category: CreateProductCategoryDTO;
}
export interface UpdateProductCategoryWorkflowInput {
    id: string;
    data: UpdateProductCategoryDTO;
}
export interface BatchUpdateProductsOnCategoryWorkflowInput extends LinkWorkflowInput {
}
//# sourceMappingURL=index.d.ts.map