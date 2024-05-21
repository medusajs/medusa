import { z } from "zod"
import { zodValidator } from "../validate-body"

describe("zodValidator", () => {
  it("should validate and return validated", async () => {
    const schema = z.object({
      id: z.string(),
      name: z.string(),
    })

    const toValidate = {
      id: "1",
      name: "Tony Stark",
    }

    const validated = await zodValidator(schema, toValidate)

    expect(JSON.stringify(validated)).toBe(
      JSON.stringify({
        id: "1",
        name: "Tony Stark",
      })
    )
  })

  it("should show human readable error message", async () => {
    const schema = z
      .object({
        id: z.string(),
        test: z.object({
          name: z.string(),
          test2: z.object({
            name: z.string(),
          }),
        }),
      })
      .strict()

    const toValidate = {
      id: "1",
      name: "Tony Stark",
      company: "Stark Industries",
    }

    const errorMessage = await zodValidator(schema, toValidate).catch(
      (e) => e.message
    )

    expect(errorMessage).toContain(
      "Invalid request body: "
    )
  })

  it("should allow for non-strict parsing", async () => {
    const schema = z.object({
      id: z.string(),
    })

    const toValidate = {
      id: "1",
      name: "Tony Stark",
      company: "Stark Industries",
    }

    const validated = await zodValidator(schema, toValidate, { strict: false })

    expect(JSON.stringify(validated)).toBe(
      JSON.stringify({
        id: "1",
      })
    )
  })
})
