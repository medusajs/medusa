---
description: 'Learn how to override the cart completion strategy to implement your custom cart completion strategy.'
addHowToData: true
---

# How to Override Cart Completion Strategy

In this document, you’ll learn how to override the cart completion strategy.

:::note

This guide only explains how to override the cart completion strategy. It’s highly recommended to first understand how Medusa implements the cart completion strategy as explained [here](../cart.md#cart-completion-process).

:::

---

## Step 1: Create Strategy Class

Create a TypeScript or JavaScript file in `src/strategies` of your Medusa backend project with a class that extends the `AbstractCartCompletionStrategy` class:

```ts title="src/strategies/cart-completion.ts"
import { 
  AbstractCartCompletionStrategy,
  CartCompletionResponse,
  IdempotencyKey } from "@medusajs/medusa"
import { 
  RequestContext,
} from "@medusajs/medusa/dist/types/request"

class CartCompletionStrategy 
  extends AbstractCartCompletionStrategy {

  complete(
    cartId: string, 
    idempotencyKey: IdempotencyKey, 
    context: RequestContext
  ): Promise<CartCompletionResponse> {
    throw new Error("Method not implemented.")
  }

}

export default CartCompletionStrategy
```

The class includes the `complete` method defined as abstract in `AbstractCartCompletionStrategy`. At the moment, the method only throws an error.

### Using a Constructor

You can use a constructor to access services and resources registered in the dependency container using dependency injection. For example:

<!-- eslint-disable prefer-rest-params -->

```ts title="src/strategies/cart-completion.ts"
// ...
import { IdempotencyKeyService } from "@medusajs/medusa"

type InjectedDependencies = {
  idempotencyKeyService: IdempotencyKeyService
}

class CartCompletionStrategy 
  extends AbstractCartCompletionStrategy {

  protected readonly idempotencyKeyService_: 
    IdempotencyKeyService

  constructor(
    { idempotencyKeyService }: InjectedDependencies
  ) {
    super(arguments[0])
    this.idempotencyKeyService_ = idempotencyKeyService
  }
    
  // ...
}

export default CartCompletionStrategy
```

In the above example, you inject the `IdempotencyKeyService` in the constructor. This allows you to use the `IdempotencyKeyService` within your class.

---

## Step 2: Implement the complete Method

The cart completion strategy is required to implement a single method: the `complete` method. This method is used in the [Complete Cart API Route](https://docs.medusajs.com/api/store#carts_postcartscartcomplete) to handle the logic of completing the cart.

The method accepts three parameters:

- `cartId`: the first parameter of the method, which is a string indicating the ID of the cart to complete.
- `idempotencyKey`: the second parameter of the method, which is an instance of the `IdempotencyKey` entity. The idempotency key is retrieved based on the idempotency key passed in the header of the request, and it’s used to determine the current point reached in the checkout flow to avoid inconsistencies on interruptions. You can learn more about the idempotency key [here](../cart.md#idempotency-key). You can also learn how to use it within your strategy by following [this guide](../../../development/idempotency-key/use-service.md)
- `context`: the third parameter of the method, which is an object that holds a single property `ip`. `ip` is a string indicating the IP of the customer.

The completion strategy is expected to return an object with the following properties:

- `response_code`: a number indicating the response code.
- `response_body`: an object that will be returned to the client.

You can refer to [this guide](../cart.md#cart-completion-process) to learn how the cart conceptual guide is implemented in the Medusa backend. This can help you understand how details such as inventory, taxes, and more are handled.

---

## Step 3: Run Build Command

In the directory of the Medusa backend, run the `build` command to transpile the files in the `src` directory into the `dist` directory:

```bash npm2yarn
npm run build
```

---

## Test it Out

Run your backend to test it out:

```bash npm2yarn
npx medusa develop
```

Then, try out your strategy using the Complete Cart API Route. You should see the logic you implemented used for completing the cart.

---

## See Also

- [How to implement cart functionalities in the storefront](../storefront/implement-cart.mdx)
- [How to implement checkout flow in the storefront](../storefront/implement-checkout-flow.mdx)
