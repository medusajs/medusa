# TSDoc: Events

Event constants live in `packages/core/utils/src/core-flows/events.ts`. They are grouped into namespace objects (e.g. `CartWorkflowEvents`, `OrderWorkflowEvents`) exported as `const`.

## Rules

- Document every event constant with a description of when it is emitted
- Always include `@eventPayload` showing the shape of the emitted data
- Add `@since` when the event is new in the commit diff (version from prompt)
- Add `@featureFlag` when the event is behind a feature flag
- Do NOT document the namespace object itself unless it lacks a description — the individual event constants are what matters

## Event Constant Format

```typescript
/**
 * Emitted when [resource] is [action].
 *
 * @eventPayload
 * ```ts
 * {
 *   id, // The ID of the [resource]
 * }
 * ```
 */
CREATED: "resource.created",
```

## @eventPayload — Payload Shape

`@eventPayload` uses a TypeScript code block listing the properties emitted with the event. Each property gets an inline comment:

```typescript
/**
 * Emitted when a cart is created.
 *
 * @eventPayload
 * ```ts
 * {
 *   id, // The ID of the cart
 * }
 * ```
 */
CREATED: "cart.created",
```

For events with richer payloads, including non-string fields — annotate the type in parentheses:

```typescript
/**
 * Emitted when the customer in the cart is transferred.
 *
 * @eventPayload
 * ```ts
 * {
 *   id,           // The ID of the cart
 *   customer_id,  // The ID of the customer
 * }
 * ```
 */
CUSTOMER_TRANSFERRED: "cart.customer_transferred",

/**
 * Emitted when an order's fulfillment is created.
 *
 * @eventPayload
 * ```ts
 * {
 *   order_id,        // The ID of the order
 *   fulfillment_id,  // The ID of the fulfillment
 *   no_notification, // (boolean) Whether to notify the customer
 * }
 * ```
 */
FULFILLMENT_CREATED: "order.fulfillment_created",
```

> Use `(type)` in the inline comment whenever the value is not a string — e.g. `// (boolean) ...`, `// (number) ...`, `// (array) ...`. Omit the type annotation for plain string IDs.

## @since — New Events

Add `@since` when the event is new in this commit's diff:

```typescript
/**
 * Emitted when a translation is created.
 *
 * @since 2.14.0
 *
 * @eventPayload
 * ```ts
 * {
 *   id, // The ID of the translation
 * }
 * ```
 */
TRANSLATIONS_CREATED: "translations.created",
```

> Place `@since` before `@eventPayload` so version information appears first.

## @featureFlag — Feature-Gated Events

Add `@featureFlag` for events that are only emitted when a feature flag is enabled:

```typescript
/**
 * Emitted when a translation is created.
 *
 * @since 2.14.0
 * @featureFlag translation
 *
 * @eventPayload
 * ```ts
 * {
 *   id, // The ID of the translation
 * }
 * ```
 */
TRANSLATIONS_CREATED: "translations.created",
```

## Namespace Object

If the namespace object (e.g. `CartWorkflowEvents`) itself lacks a TSDoc, add one with `@customNamespace` and `@category` if used consistently elsewhere in the file:

```typescript
/**
 * @category Cart
 * @customNamespace Cart
 */
export const CartWorkflowEvents = {
```

Only add this if sibling namespaces in the file already use this pattern. Do not introduce it on namespaces that don't already follow it.

## Full Before/After Example

**Before:**

```typescript
export const OrderWorkflowEvents = {
  PLACED: "order.placed",
  CANCELED: "order.canceled",
  COMPLETED: "order.completed",
}
```

**After:**

```typescript
export const OrderWorkflowEvents = {
  /**
   * Emitted when an order is placed.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   * }
   * ```
   */
  PLACED: "order.placed",

  /**
   * Emitted when an order is cancelled.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   * }
   * ```
   */
  CANCELED: "order.canceled",

  /**
   * Emitted when an order is completed.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   * }
   * ```
   */
  COMPLETED: "order.completed",
}
```
