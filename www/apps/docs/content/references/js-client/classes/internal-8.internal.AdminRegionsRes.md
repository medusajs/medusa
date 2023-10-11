---
displayed_sidebar: jsClientSidebar
---

# Class: AdminRegionsRes

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminRegionsRes

**`Schema`**

AdminRegionsRes
type: object
x-expanded-relations:
  field: region
  relations:
    - countries
    - fulfillment_providers
    - payment_providers
  eager:
    - fulfillment_providers
    - payment_providers
required:
  - region
properties:
  region:
    description: "Region details."
    $ref: "#/components/schemas/Region"

## Properties

### region

• **region**: [`Region`](internal-3.Region.md)

#### Defined in

packages/medusa/dist/api/routes/admin/regions/index.d.ts:29
