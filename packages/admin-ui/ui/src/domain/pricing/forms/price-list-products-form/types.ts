import * as z from "zod"
import { priceListProductsSchema } from "./schema"

export type PriceListProductsSchema = z.infer<typeof priceListProductsSchema>
