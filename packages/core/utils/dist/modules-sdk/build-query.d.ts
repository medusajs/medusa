import { DAL, FindConfig } from "@medusajs/types";
export declare function buildQuery<T = any, TDto = any>(filters?: Record<string, any>, config?: FindConfig<TDto> & {
    primaryKeyFields?: string | string[];
}): DAL.FindOptions<T>;
