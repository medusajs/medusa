import { z } from "zod";

export const GiftCardCreateSchema = z.object({
  value: z.object({
    /**
     * The parsed numeric value. The currency input exposes this alongside the
     * formatted string, and it is locale independent.
     */
    float: z.number(),
    /**
     * The formatted value as typed by the user, e.g. "14,13" in locales that
     * use a comma as the decimal separator.
     */
    value: z.string(),
  }),
  currency_code: z.string({
    error: "Currency is required",
  }),
  expires_at: z.date().nullable().optional(),
  note: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});
