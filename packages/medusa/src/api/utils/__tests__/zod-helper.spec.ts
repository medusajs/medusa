import { z } from "zod"
import { zodValidator } from "../zod-helper"

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

  it("should show human readable error message for invalid data and unrecognized fields", async () => {
    const errorMessage = await zodValidator(
      z
        .object({
          id: z.string(),
          test: z.object({
            name: z.string(),
            test2: z.object({
              name: z.string(),
            }),
          }),
        })
        .strict(),
      {
        id: "1",
        name: "Tony Stark",
        company: "Stark Industries",
      }
    ).catch((e) => e.message)

    expect(errorMessage).toContain(
      "Invalid request: Field 'test' is required; Unrecognized fields: 'name, company'"
    )
  })

  it("should show human readable error message for invalid type", async () => {
    const errorMessage = await zodValidator(
      z
        .object({
          id: z.string(),
        })
        .strict(),
      {
        id: 1,
      }
    ).catch((e) => e.message)

    expect(errorMessage).toContain(
      "Invalid request: Expected type: 'string' for field 'id', got: 'number'"
    )
  })

  it("should show human readable error message for invalid enum", async () => {
    const errorMessage = await zodValidator(
      z
        .object({
          id: z.enum(["1", "2"]),
        })
        .strict(),
      {
        id: "3",
      }
    ).catch((e) => e.message)

    expect(errorMessage).toContain(
      "Invalid request: Expected: '1, 2' for field 'id', but got: '3'"
    )
  })

  it("should show human readable error message for invalid union", async () => {
    const errorMessage = await zodValidator(
      z
        .object({
          id: z.union([z.string(), z.number()]),
        })
        .strict(),
      {
        id: true,
      }
    ).catch((e) => e.message)

    expect(errorMessage).toContain(
      "Invalid request: Expected type: 'string, number' for field 'id', got: 'boolean'"
    )
  })

  it("should show human readable error message for missing required field", async () => {
    const errorMessage = await zodValidator(
      z
        .object({
          id: z.union([z.string(), z.number()]),
        })
        .strict(),
      {}
    ).catch((e) => e.message)

    expect(errorMessage).toContain("Invalid request: Field 'id' is required")
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

    const validated = await zodValidator(schema, toValidate)

    expect(JSON.stringify(validated)).toBe(
      JSON.stringify({
        id: "1",
      })
    )
  })
})
