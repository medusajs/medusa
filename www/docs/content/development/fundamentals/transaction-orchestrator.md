---
description: 'Learn about the Transaction Orchestrator used in the core Medusa package. The transaction orchestrator (TO) offers an effective way of managing transactions within an increasingly complex environment.'
---

# Transaction Orchestrator

In this document, you’ll learn about the Transaction Orchestrator used in the core Medusa package.

## Introduction

The transaction orchestrator (TO) offers an effective way of managing transactions within an increasingly complex environment. It supports Medusa’s modularity and composability by handling transactions from different modules rather than one whole system.

Medusa’s core package uses the transaction orchestrator to enhance the control and management of transactions and workflows across multiple services or modules. It simplifies creating and executing distributed transactions.

The transaction orchestrator supervises transaction flows and guarantees that successful transactions are executed fully or entirely rolled back in case of failure. With clearly defined steps to Invoke and Compensate actions, the transaction orchestrator follows the separation of concerns principle, providing you with improved control over transactions and workflows.

---

## Why Medusa Uses the Transaction Orchestrator

The transaction orchestrator is a necessity for modular or distributed systems in scenarios where a given workflow involves different modules for several reasons:

1. **Data consistency:** In a distributed system, maintaining data consistency across different databases becomes challenging. A transaction orchestrator ensures that if any part of the transaction fails, all the previous steps are rolled back (compensated), keeping the data consistent across all involved databases.
2. **Coordination:** The transaction orchestrator acts as a coordinator between different modules and their respective servers. It also manages the order of execution and communication between modules, ensuring that each transaction step is executed correctly and at the right time.
3. **Simplifying complex workflows:** In a distributed environment, transactions can become complex due to the need to coordinate between different services and databases. A transaction orchestrator simplifies this process by abstracting away the complexities of managing distributed transactions, allowing developers to focus on implementing the business logic.
4. **Scalability:** As a system grows, managing transactions across multiple services becomes increasingly difficult. A transaction orchestrator helps with scalability by providing a robust framework for managing distributed transactions, making it easier to maintain and expand the system.

In addition to the above reasons, there are reasons more relevant in the context of digital commerce which makes it an important addition to Medusa’s toolbox. These reasons are:

- **Composable architectures:** A transaction orchestrator supports composable architectures, allowing developers to easily combine and reuse modules as needed. This enables the creation of highly customizable commerce applications, tailored to specific business requirements.
- **Adoption in legacy systems:** The transaction orchestrator can also facilitate the gradual transition of legacy systems to more modern, distributed architectures. This makes it easier for businesses to adopt and integrate new technologies without having to rebuild their entire infrastructure from scratch.
- **Unlocking infrastructure technologies:** With a transaction orchestrator, developers can leverage advanced infrastructure technologies, such as serverless and edge computing. This can lead to improved performance, reduced latency, and increased reliability for commerce applications, resulting in better user experiences and higher customer satisfaction.

---

## Example of Using the Transaction Orchestrator

To better illustrate how the transaction orchestrator works, here’s an example of how it’s used in the multi-warehouse feature that coordinates the flow to create a product variant, creating an inventory item and finally linking both together:

```ts
const createVariantFlow: TransactionStepsDefinition = {
  next: {
      action: "createVariantStep",
      saveResponse: true,
      next: {
          action: "createInventoryItemStep",
          saveResponse: true,
          next: {
              action: "attachInventoryItemStep",
              noCompensation: true,
          },
      },
  },
}
```

The actions are handled by a single function called by the transaction orchestrator:

```ts
async function transactionHandler(
    actionId: string,
    type: TransactionHandlerType,
    payload: TransactionPayload
) {
  const command = {
      createVariantStep: {
          invoke: async (data: CreateProductVariantInput) => {
              return await createProductVariant(data) // omitted
          },
          compensate: async (
            data: CreateProductVariantInput, 
            { invoke }
          ) => {
              await removeProductVariant(
                invoke.createVariantStep
              ) // omitted
          },
      },
      createInventoryItemStep: {
          invoke: async (
            data: CreateProductVariantInput, 
            { invoke }
          ) => {
              return await createInventoryItem(
                invoke.createVariantStep
              ) // omitted
          },
          compensate: async (
            data: CreateProductVariantInput, 
            { invoke }
          ) => {
              await removeInventoryItem(
                invoke.createInventoryItemStep
              ) // omitted
          },
      },
      attachInventoryItemStep: {
          invoke: async (
            data: CreateProductVariantInput, 
            { invoke }
          ) => {
              return await attachInventoryItem( // omitted
                  invoke.createVariantStep,
                  invoke.createInventoryItemStep
              )
          },
      },
  }

  return command[actionId][type](payload.data, payload.context)
}
```

Note that the implementation of each function was omitted to keep the example short; however, their names are self-explanatory.

Finally, the transaction orchestrator is instantiated and a new transaction initialized:

```ts
const strategy = new TransactionOrchestrator(
  "create-variant-with-inventory", // transaction name
  createVariantFlow // transaction steps definition
)

const transaction = await strategy.beginTransaction(
  ulid(), // unique id
  transactionHandler, // handler
  createProductVariantInput // input
)
await strategy.resume(transaction)
```

---

## Achieving Cleaner Code with the Transaction Orchestrator

Utilizing a transaction orchestrator results in cleaner code and single-responsibility functions compared to manually managing distributed transactions. This is due to several factors:

1. **Abstraction:** A transaction orchestrator abstracts the complexity of managing distributed transactions by providing a standardized framework for defining transaction steps, their corresponding compensation actions, and the flow of execution.
2. **Separation of concerns:** By clearly delineating the responsibilities of each function, the transaction orchestrator enforces the separation of concerns. Each function is responsible for either the "Invoke" (execution) or "Compensate" (rollback) action, ensuring they perform a single, specific task. This makes the code more readable, maintainable, and testable.
3. **Modularity:** By using a transaction orchestrator, the code becomes more modular, as each step in the transaction is encapsulated within its own function. This allows developers to easily modify, add, or remove transaction steps without affecting the overall structure of the transaction.
4. **Error Handling:** When handling distributed transactions manually, the code can become convoluted due to intricate error handling logic. The transaction orchestrator simplifies this by automatically managing errors and retries, allowing developers to create cleaner code without the need to address error handling for each step.
5. **Reusability:** The transaction orchestrator allows you to define reusable functions for both the "Invoke" and "Compensate" actions, which can be easily reused across different transaction scenarios. This reduces code duplication and ensures that changes to a specific action only need to be made in one place.

---

## Handling Complex Workflows with the Transaction Orchestrator

The Transaction Orchestrator enables developers to create complex workflows for synchronous and long-running tasks that may take a while to receive a response (asynchronous). These workflows can be organized in a way that may not necessarily be transactional, but can still be effectively orchestrated.

There are several scenarios where asynchronous workflows with long-running steps can be applied using the transaction orchestrator:

1. **Order fulfillment:** In a commerce system, a workflow might involve creating an order, reserving inventory, charging the customer, generating shipping labels, and updating the shipping status. Some of these steps, such as generating shipping labels or charging the customer, could take a considerable amount of time due to external dependencies like payment gateways and shipping services.
2. **Fraud detection and prevention:** fraud detection and prevention workflows might involve analyzing customer data, order patterns, and payment information to identify potential fraudulent activities. These workflows may include time-consuming tasks like querying external fraud detection APIs or applying machine learning models to analyze data.
3. **Returns and refunds processing:** In a returns and refunds workflows, several steps may involve long-running tasks, such as receiving returned products, inspecting their condition, updating inventory, and processing refunds. Some of these steps may take a considerable amount of time, especially when dealing with external payment gateways or waiting for products to be returned and inspected.

In all these examples, workflows are valuable for handling intricate, multistep processes that include tasks taking considerable time or involving external dependencies without immediate responses.
