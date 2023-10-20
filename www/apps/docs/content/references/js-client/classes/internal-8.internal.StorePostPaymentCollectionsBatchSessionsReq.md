---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostPaymentCollectionsBatchSessionsReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostPaymentCollectionsBatchSessionsReq

**`Schema`**

StorePostPaymentCollectionsBatchSessionsReq
type: object
required:
  - sessions
properties:
  sessions:
    description: "An array of payment sessions related to the Payment Collection. Existing sessions that are not added in this array will be deleted."
    type: array
    items:
      type: object
      required:
        - provider_id
        - amount
      properties:
        provider_id:
          type: string
          description: The ID of the Payment Provider.
        amount:
          type: integer
          description: "The payment amount"
        session_id:
          type: string
          description: "The ID of the Payment Session to be updated. If no ID is provided, a new payment session is created."

## Properties

### sessions

• **sessions**: [`StorePostPaymentCollectionsSessionsReq`](internal-8.internal.StorePostPaymentCollectionsSessionsReq.md)[]

#### Defined in

packages/medusa/dist/api/routes/store/payment-collections/manage-batch-payment-sessions.d.ts:131
