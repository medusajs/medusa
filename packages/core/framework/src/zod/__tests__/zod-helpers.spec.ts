import { MedusaError } from "@medusajs/utils"
import { z } from "@medusajs/deps/zod"
import { zodValidator } from "../zod-helpers"

describe("zodValidator", () => {
  describe("error formatting", () => {
    it("should format required field errors", async () => {
      const schema = z.object({
        name: z.string(),
      })

      await expect(zodValidator(schema, {})).rejects.toThrow(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid request: Field 'name' is required"
        )
      )
    })

    it("should format invalid type errors", async () => {
      const schema = z.object({
        count: z.number(),
      })

      await expect(
        zodValidator(schema, { count: "not a number" })
      ).rejects.toThrow(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid request: Expected type: 'number' for field 'count', got: 'not a number'"
        )
      )
    })

    it("should format invalid value errors with enum", async () => {
      const schema = z.object({
        status: z.enum(["active", "inactive"]),
      })

      await expect(zodValidator(schema, { status: "invalid" })).rejects.toThrow(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid request: Expected: 'active, inactive' for field 'status', but got: 'invalid'"
        )
      )
    })

    it("should format unrecognized keys errors", async () => {
      const schema = z.object({
        name: z.string(),
      })

      await expect(
        zodValidator(schema, { name: "test", extra: "field" })
      ).rejects.toThrow(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid request: Unrecognized fields: 'extra'"
        )
      )
    })

    it("should preserve parent path in union errors", async () => {
      const geoZoneSchema = z.object({
        type: z.enum(["country", "province"]),
        country_code: z.string(),
      })

      const schema = z.object({
        geo_zones: z.array(geoZoneSchema),
      })

      // Missing type field at index 2
      await expect(
        zodValidator(schema, {
          geo_zones: [
            { type: "country", country_code: "US" },
            { type: "province", country_code: "CA" },
            { country_code: "UK" }, // missing type
          ],
        })
      ).rejects.toThrow(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid request: Field 'geo_zones, 2, type' is required"
        )
      )
    })

    it("should handle discriminated union with invalid type value", async () => {
      // This matches the actual geo_zones schema structure with z.union of z.literal types
      const geoZoneCountrySchema = z.object({
        type: z.literal("country"),
        country_code: z.string(),
      })

      const geoZoneProvinceSchema = z.object({
        type: z.literal("province"),
        country_code: z.string(),
        province_code: z.string(),
      })

      const schema = z.object({
        geo_zones: z.array(
          z.union([geoZoneCountrySchema, geoZoneProvinceSchema])
        ),
      })

      await expect(
        zodValidator(schema, {
          geo_zones: [
            { type: "country", country_code: "US" },
            { type: "province", country_code: "CA", province_code: "ON" },
            { type: "region", country_code: "UK" }, // invalid type
          ],
        })
      ).rejects.toThrow(/geo_zones.*2.*type/)
    })

    it("should preserve parent path in nested union errors", async () => {
      const addressSchema = z.object({
        street: z.string(),
        city: z.string(),
      })

      const locationSchema = z.object({
        name: z.string(),
        address: addressSchema,
      })

      const schema = z.object({
        locations: z.array(locationSchema),
      })

      await expect(
        zodValidator(schema, {
          locations: [
            { name: "HQ", address: { street: "123 Main", city: "NYC" } },
            { name: "Branch", address: { street: "456 Oak" } }, // missing city
          ],
        })
      ).rejects.toThrow(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid request: Field 'locations, 1, address, city' is required"
        )
      )
    })

    it("should format too_small errors", async () => {
      const schema = z.object({
        count: z.number().min(5),
      })

      await expect(zodValidator(schema, { count: 2 })).rejects.toThrow(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid request: Value for field 'count' too small, expected at least: '5'"
        )
      )
    })

    it("should format too_big errors", async () => {
      const schema = z.object({
        count: z.number().max(10),
      })

      await expect(zodValidator(schema, { count: 15 })).rejects.toThrow(
        new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invalid request: Value for field 'count' too big, expected at most: '10'"
        )
      )
    })

    it("should limit error messages to 3 issues", async () => {
      const schema = z.object({
        a: z.string(),
        b: z.string(),
        c: z.string(),
        d: z.string(),
        e: z.string(),
      })

      try {
        await zodValidator(schema, {})
        fail("Expected error to be thrown")
      } catch (err) {
        const error = err as MedusaError
        // Should only contain 3 error messages separated by "; "
        const messageCount = error.message.split("; ").length
        expect(messageCount).toBeLessThanOrEqual(3)
      }
    })

    it("should handle transformed schemas (ZodPipe)", async () => {
      const schema = z
        .object({
          id: z.string(),
          count: z.number(),
        })
        .transform((d) => ({ ...d, normalized: true }))

      // Wrong type for id
      await expect(zodValidator(schema, { id: 123, count: 5 })).rejects.toThrow(
        /Expected type.*string.*id/
      )

      // Missing required field
      await expect(zodValidator(schema, { id: "test" })).rejects.toThrow(
        /Field.*count.*required/
      )
    })

    it("should handle deeply nested union errors (3+ levels)", async () => {
      const innerSchema = z.object({
        value: z.string(),
      })

      const middleSchema = z.object({
        inner: innerSchema,
      })

      const outerSchema = z.object({
        middle: middleSchema,
      })

      const schema = z.object({
        items: z.array(outerSchema),
      })

      await expect(
        zodValidator(schema, {
          items: [
            { middle: { inner: { value: "valid" } } },
            { middle: { inner: { value: 123 } } }, // wrong type at deep level
          ],
        })
      ).rejects.toThrow(/items.*1.*middle.*inner.*value/)
    })

    it("should handle async validation with refine", async () => {
      const schema = z.object({
        email: z.string().refine(async (val) => val.includes("@"), {
          message: "Invalid email format",
        }),
      })

      await expect(
        zodValidator(schema, { email: "invalid-email" })
      ).rejects.toThrow(/Invalid email format/)
    })

    it("should handle superRefine custom validations", async () => {
      const schema = z
        .object({
          password: z.string(),
          confirmPassword: z.string(),
        })
        .superRefine((data, ctx) => {
          if (data.password !== data.confirmPassword) {
            ctx.addIssue({
              code: "custom",
              message: "Passwords do not match",
              path: ["confirmPassword"],
            })
          }
        })

      await expect(
        zodValidator(schema, {
          password: "secret123",
          confirmPassword: "different",
        })
      ).rejects.toThrow(/Passwords do not match/)
    })

    it("should handle custom error codes", async () => {
      const schema = z.object({
        age: z.number().refine((val) => val >= 18, {
          message: "Must be 18 or older",
        }),
      })

      await expect(zodValidator(schema, { age: 15 })).rejects.toThrow(
        /Must be 18 or older/
      )
    })

    it("should handle nested transforms with validation errors", async () => {
      const innerSchema = z
        .object({
          value: z.string(),
        })
        .transform((d) => ({ ...d, processed: true }))

      const schema = z.object({
        items: z.array(innerSchema),
      })

      await expect(
        zodValidator(schema, {
          items: [{ value: "valid" }, { value: 123 }],
        })
      ).rejects.toThrow(/items.*1.*value/)
    })

    it("should handle optional fields correctly", async () => {
      const schema = z.object({
        required: z.string(),
        optional: z.string().optional(),
      })

      // Should pass with optional field missing
      await expect(
        zodValidator(schema, { required: "value" })
      ).resolves.toEqual({ required: "value" })

      // Should fail with required field missing
      await expect(zodValidator(schema, { optional: "value" })).rejects.toThrow(
        /Field.*required.*is required/
      )
    })

    it("should handle nullable fields correctly", async () => {
      const schema = z.object({
        name: z.string().nullable(),
      })

      // Should pass with null value
      await expect(zodValidator(schema, { name: null })).resolves.toEqual({
        name: null,
      })

      // Should fail with wrong type
      await expect(zodValidator(schema, { name: 123 })).rejects.toThrow(
        /Expected type.*string.*name/
      )
    })
  })
})
