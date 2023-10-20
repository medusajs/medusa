---
displayed_sidebar: jsClientSidebar
---

# Class: StorePostPaymentCollectionsBatchSessionsAuthorizeReq

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StorePostPaymentCollectionsBatchSessionsAuthorizeReq

**`Schema`**

StorePostPaymentCollectionsBatchSessionsAuthorizeReq
type: object
required:
  - session_ids
properties:
  session_ids:
    description: "List of Payment Session IDs to authorize."
    type: array
    items:
      type: string

## Properties

### session\_ids

• **session\_ids**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/store/payment-collections/authorize-batch-payment-sessions.d.ts:71
