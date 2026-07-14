import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("no-wildcard-with-specific-fields", rule, {
  valid: [
    // Wildcard alone.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: ["*"],
        })
      `,
    },
    // Wildcard with relation wildcard — relations are kept.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: ["*", "items.*"],
        })
      `,
    },
    // Wildcard with relation field — relations are kept.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: ["*", "items.title"],
        })
      `,
    },
    // Wildcard with multiple relation selections only.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: ["*", "items.*", "region.name"],
        })
      `,
    },
    // Specific top-level fields without a wildcard.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: ["id", "total"],
        })
      `,
    },
    // useQueryGraphStep with wildcard alone.
    {
      code: `
        const { data } = useQueryGraphStep({
          entity: "cart",
          fields: ["*", "items.title"],
        })
      `,
    },
    // Not a graph query — unrelated method named the same has no fields concern.
    {
      code: `
        const result = something.build({
          fields: ["*", "total"],
        })
      `,
    },
    // graph call without a fields property.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
        })
      `,
    },
    // fields is not an inline array literal.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: myFields,
        })
      `,
    },
    // First argument is not an object literal.
    {
      code: `
        const { data } = await query.graph(config)
      `,
    },
  ],
  invalid: [
    // The canonical example.
    {
      code: `
        const { data: [cart] } = await query.graph({
          entity: "cart",
          fields: ["*", "total"],
          filters: {
            id: "cart_123",
          },
        })
      `,
      errors: [{ messageId: "wildcardWithSpecificFields" }],
    },
    // Wildcard listed after the specific field.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: ["total", "*"],
        })
      `,
      errors: [{ messageId: "wildcardWithSpecificFields" }],
    },
    // Multiple dropped top-level fields — reported once.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: ["*", "total", "subtotal"],
        })
      `,
      errors: [{ messageId: "wildcardWithSpecificFields" }],
    },
    // Mix of dropped top-level fields and kept relation selections.
    {
      code: `
        const { data } = await query.graph({
          entity: "cart",
          fields: ["*", "total", "items.title"],
        })
      `,
      errors: [{ messageId: "wildcardWithSpecificFields" }],
    },
    // useQueryGraphStep.
    {
      code: `
        const { data } = useQueryGraphStep({
          entity: "cart",
          fields: ["*", "total"],
        })
      `,
      errors: [{ messageId: "wildcardWithSpecificFields" }],
    },
  ],
})
