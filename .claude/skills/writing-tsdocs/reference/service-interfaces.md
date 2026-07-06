# TSDoc: Service Interfaces, JS SDK, Providers, and Workflow SDK

This reference covers four file types that all use the same **full JSDoc** pattern:
- Service interfaces in `packages/core/types/src/`
- JS SDK methods in `packages/core/js-sdk/src/`
- Abstract providers in `packages/core/utils/src/`
- Workflow SDK composer functions in `packages/core/workflows-sdk/src/utils/composer/`

## Rules

- Document the interface/class itself with a 1-sentence description
- Document every public method with: description, `@param`, `@returns`, `@example`
- For JS SDK methods, also add `@tags <category>` matching the SDK module (e.g. `@tags products`)
- Method description starts with "This method [verb phrase]."
- `@param` format: `@param {Type} name - Description.`
- `@returns` format: `@returns {Promise<Type>} Description of resolved value.`
- `@example` shows realistic usage code

## Interface/Class Description

```typescript
/**
 * The main service interface for the Product Module.
 */
export interface IProductModuleService extends IModuleService {
```

```typescript
/**
 * An abstract class for payment providers. Extend this class to create a payment provider.
 */
export abstract class AbstractPaymentProvider {
```

## Full Method Pattern

```typescript
/**
 * This method retrieves a product by its ID.
 *
 * @param {string} productId - The ID of the product to retrieve.
 * @param {FindConfig<ProductDTO>} config - The configurations determining how the product is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a product.
 * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
 * @returns {Promise<ProductDTO>} The retrieved product.
 *
 * @example
 * const product = await productModuleService.retrieveProduct("prod_123")
 */
retrieveProduct(
  productId: string,
  config?: FindConfig<ProductDTO>,
  sharedContext?: Context
): Promise<ProductDTO>
```

## List Methods

```typescript
/**
 * This method retrieves a paginated list of products based on optional filters and configuration.
 *
 * @param {FilterableProductProps} filters - The filters to apply on the retrieved products.
 * @param {FindConfig<ProductDTO>} config - The configurations determining how the products are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a product.
 * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
 * @returns {Promise<ProductDTO[]>} The list of products.
 *
 * @example
 * To retrieve a list of products using their IDs:
 *
 * ```ts
 * const products = await productModuleService.listProducts({
 *   id: ["prod_123", "prod_456"],
 * })
 * ```
 *
 * To specify relations that should be retrieved:
 *
 * ```ts
 * const products = await productModuleService.listProducts(
 *   {},
 *   { relations: ["variants"] }
 * )
 * ```
 */
listProducts(
  filters?: FilterableProductProps,
  config?: FindConfig<ProductDTO>,
  sharedContext?: Context
): Promise<ProductDTO[]>
```

## Create/Update Methods

```typescript
/**
 * This method creates products.
 *
 * @param {CreateProductDTO[]} data - The products to create.
 * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
 * @returns {Promise<ProductDTO[]>} The created products.
 *
 * @example
 * const products = await productModuleService.createProducts([
 *   {
 *     title: "Shirt",
 *     options: [{ title: "Color", values: ["Blue", "Green"] }],
 *   },
 * ])
 */
createProducts(
  data: CreateProductDTO[],
  sharedContext?: Context
): Promise<ProductDTO[]>
```

## JS SDK Methods — add @tags

JS SDK methods should include `@tags` matching the parent SDK property's tag pattern:

```typescript
/**
 * This method retrieves a product by its ID.
 *
 * @param {string} id - The ID of the product to retrieve.
 * @param {SelectParams} query - Configure the fields to retrieve in the product.
 * @param {RequestInit} headers - Headers to pass in the request.
 * @returns {Promise<HttpTypes.AdminProductResponse>} The product's details.
 *
 * @example
 * const product = await sdk.admin.product.retrieve("prod_123")
 *
 * @tags products
 */
async retrieve(
  id: string,
  query?: SelectParams,
  headers?: RequestInit["headers"]
): Promise<HttpTypes.AdminProductResponse> {
```

## Abstract Provider Methods

```typescript
/**
 * This method initiates a payment session.
 *
 * @param {InitiatePaymentInput} input - The details of the payment session to initiate.
 * @returns {Promise<PaymentProviderSessionResponse>} The created payment session.
 *
 * @example
 * class MyPaymentProvider extends AbstractPaymentProvider {
 *   async initiatePayment(input) {
 *     const externalSession = await this.client.createSession(input.amount)
 *     return {
 *       id: externalSession.id,
 *       data: externalSession,
 *     }
 *   }
 * }
 */
abstract initiatePayment(
  input: InitiatePaymentInput
): Promise<PaymentProviderSessionResponse>
```

## Workflow SDK Composer Functions

```typescript
/**
 * Creates a new workflow step with the specified ID and handler.
 *
 * @param {string} stepId - The unique identifier for the step.
 * @param {Function} invokeFn - The function to run when the step executes.
 * @param {Function} [compensateFn] - The function to run when compensating (rolling back) the step.
 * @returns {StepFunction} The created step function.
 *
 * @example
 * const myStep = createStep(
 *   "my-step",
 *   async (input: { id: string }, { container }) => {
 *     const service = container.resolve("myService")
 *     await service.doSomething(input.id)
 *     return new StepResponse(void 0, input.id)
 *   },
 *   async (id, { container }) => {
 *     const service = container.resolve("myService")
 *     await service.undoSomething(id)
 *   }
 * )
 */
export function createStep<TInput, TOutput, TCompensateInput>(
  stepId: string,
  invokeFn: StepFunction<TInput, TOutput>,
  compensateFn?: StepFunction<TCompensateInput, void>
): ReturnType<typeof createStep>
```

## @example with Multiple Scenarios

When a method has multiple common use cases, show them with labels:

```typescript
 * @example
 * A simple example that retrieves a product by its ID:
 *
 * ```ts
 * const product = await productModuleService.retrieveProduct("prod_123")
 * ```
 *
 * To specify relations that should be retrieved:
 *
 * ```ts
 * const product = await productModuleService.retrieveProduct(
 *   "prod_123",
 *   { relations: ["variants"] }
 * )
 * ```
```

## sharedContext Parameter

The `sharedContext` parameter appears on virtually all module service methods. Use this standard description:

```
@param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
```
