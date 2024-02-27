---
description: 'Learn how to create a loader in Medusa. A loader can be created in the Medusa backend codebase, in a plugin, or in a module.'
addHowToData: true
---

# How to Use IdempotencyKeyService

In this document, you'll learn how to use the `IdempotencyKeyService`.

## Overview

You can use the `IdempotencyKeyService` within your custom development to ensure that your custom API Routes and operations can be safely retried or continued if an error occurs. This guide is also useful if you're overriding an existing feature in Medusa that uses the `IdempotencyKeyService` and you want to maintain its usage, such as if you're overriding the cart completion strategy.

The `IdempotencyKeyService` includes methods that can be used to create and update idempotency keys, among other functionalities.

---

## Create Idempotency Key

You can create an idempotency key within an API Route using the `create` method of the `IdempotencyKeyService`:

```ts title="src/api/store/custom/route.ts"
import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import { IdempotencyKeyService } from "@medusajs/medusa"

export const POST = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  // ...
  const idempotencyKeyService = req.scope.resolve<
    IdempotencyKeyService
  >("idempotencyKeyService")
  const idempotencyKey = await idempotencyKeyService.create({
    request_method: req.method,
    request_params: req.params,
    request_path: req.path,
  })
  // ...
}
```

The method requires as a parameter an object having the following properties:

- `request_method`: a string indicating the request method to be associated with the idempotency key.
- `request_params`: an object indicating the request parameters to be associated with the idempotency key.
- `request_path`: a string indicating the request path to be associated with the idempotency key.

The method handles generating the idempotency key value and saving the idempotency key with its details in the database. It returns the full idempotency key object.

Alternatively, you can use the `initializeRequest` method that allows you to retrieve an idempotency key based on the value passed in the `Idempotency-Key` header of the request if it exists, or create a new key otherwise. For example:

```ts title="src/api/store/custom/route.ts"
import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import { 
  IdempotencyKeyService,
} from "@medusajs/medusa"

export const POST = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  // ...
  const idempotencyKeyService = req.scope.resolve<
    IdempotencyKeyService
  >("idempotencyKeyService")
  const headerKey = req.get("Idempotency-Key") || ""

  const idempotencyKey = await idempotencyKeyService
    .initializeRequest(
      headerKey,
      req.method,
      req.params,
      req.path
    )
  // ...
}
```

The method requires the following parameters:

1. The first parameter is the key existing in the header of the request, if there's any.
2. The second parameter is the request's method.
3. The third parameter is the request's parameters.
4. The fourth method is the request's path.

The method returns the full idempotency key object.

---

## Perform Actions Within Idempotency Key Stages

Each [idempotency key stage](./overview.mdx#idempotency-key-stages) typically has transactions performed within it. Using the `IdempotencyKeyService`'s `workStage` method allows you to perform related functionalities in transactional isolation within each stage. You can access the stage or recovery point of an idempotency key using the `recovery_point` attribute.

The following example is taken from the `CartCompletionStrategy` implemented in the Medusa backend:

<!-- eslint-disable no-fallthrough -->

```ts
class CartCompletionStrategy
  extends AbstractCartCompletionStrategy {
  // ...

  async complete(
    id: string,
    ikey: IdempotencyKey,
    context: RequestContext
  ): Promise<CartCompletionResponse> {
    // ...
    let inProgress = true
    let err: unknown = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          await this.activeManager_
            .transaction(
              "SERIALIZABLE", 
              async (transactionManager) => {
                idempotencyKey = 
                  await this.idempotencyKeyService_
                    .withTransaction(transactionManager)
                    .workStage(
                      idempotencyKey.idempotency_key,
                      async (manager) =>
                        await this.handleCreateTaxLines(
                          id, 
                          {
                            manager,
                          }
                        )
                    )
              }
            )
            .catch((e) => {
              inProgress = false
              err = e
            })
          break
        }

        case "tax_lines_created": {
          // ...
        }

        case "payment_authorized": {
          // ...
        }

        case "finished": {
          // ...
        }

        default: {
          // ...
        }
      }
    }

    // ...
  }
}
```

The method requires the following parameters:

1. The first parameter is the idempotency key value.
2. The second parameter is a callback function to be executed. The function should return an object that is used to update the idempotency key's details. The object can include the following parameters:
   1. `recovery_point`: a string indicating the new recovery point associated with the idempotency key's operation. If no `recovery_point` is returned in the object, the `finished` recovery point is assigned by default.
   2. `response_code`: a number indicating the latest response code of the idempotency key's operation.
   3. `response_body`: an object indicating the latest response body of the idempotency key's operation.

The method returns an updated idempotency key object.
