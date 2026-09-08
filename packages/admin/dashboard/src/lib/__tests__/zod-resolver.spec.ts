import { zodResolver } from "@hookform/resolvers/zod"
import { describe, expect, it } from "vitest"
import { z } from "zod"

/**
 * `@hookform/resolvers` and `zod` have to stay on compatible majors.
 *
 * Resolvers v3 detects a validation failure by checking `error.errors`, which
 * only exists on zod v3 errors. Pairing it with zod v4 (where the issues moved
 * to `error.issues`) makes the resolver re-throw the ZodError instead of
 * returning it, so react-hook-form never populates `formState.errors` and every
 * form in the dashboard silently refuses to submit with no visible feedback.
 *
 * These tests fail loudly if that pairing regresses.
 */
describe("zodResolver <> zod compatibility", () => {
  const resolverOptions = {
    shouldUseNativeValidation: false,
    fields: {},
  } as any

  it("returns validation errors instead of throwing", async () => {
    const schema = z.object({
      region_id: z.string().min(1),
    })

    const result = await zodResolver(schema)(
      { region_id: "" },
      undefined,
      resolverOptions
    )

    expect(result.errors).toHaveProperty("region_id")
    expect(result.errors.region_id?.message).toBeTruthy()
  })

  it("surfaces messages added by superRefine", async () => {
    const schema = z
      .object({
        customer_id: z.string().optional(),
        email: z.union([z.literal(""), z.string().email()]).optional(),
      })
      .superRefine((data, ctx) => {
        if (!data.customer_id && !data.email) {
          ctx.addIssue({
            code: "custom",
            message: "Either a customer or email must be provided",
            path: ["email"],
          })
        }
      })

    const result = await zodResolver(schema)(
      { customer_id: "", email: "" },
      undefined,
      resolverOptions
    )

    expect(result.errors.email?.message).toBe(
      "Either a customer or email must be provided"
    )
  })

  it("resolves with no errors for a valid payload", async () => {
    const schema = z.object({ region_id: z.string().min(1) })

    const result = await zodResolver(schema)(
      { region_id: "reg_1" },
      undefined,
      resolverOptions
    )

    expect(result.errors).toEqual({})
    expect(result.values).toEqual({ region_id: "reg_1" })
  })
})
