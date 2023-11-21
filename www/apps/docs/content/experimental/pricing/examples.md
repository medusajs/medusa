# Examples of Pricing Module

In this document, you’ll find common examples of how you can use the Pricing module in your application.

:::note

Examples in this section are in the context of a Next.js App Router.

:::

## Create a Price Set

```ts
import { NextResponse } from "next/server"

import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function POST(request: Request) {
  const pricingService = await initializePricingModule()
  const body = await request.json()

  const priceSet = await pricingService.create([
    {
      prices: [
        {
          currency_code: body.currency_code,
          amount: body.amount,
        },
      ],
    },
  ])

  return NextResponse.json({ price_set: priceSet })
}
```

## List Price Sets

```ts
import { NextResponse } from "next/server"

import { 
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function GET(request: Request) {
  const pricingService = await initializePricingModule()

  const priceSets = await pricingService.list()

  return NextResponse.json({ price_sets: priceSets })
}
```

## Retrieve a Price Set by its ID

```ts
import { NextResponse } from "next/server"

import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

type ContextType = {
  params: {
    id: string
  }
}

export async function GET(
  request: Request,
  { params }: ContextType
) {
  const pricingService = await initializePricingModule()

  const priceSet = await pricingService.retrieve(params.id)

  return NextResponse.json({ price_set: priceSet })
}
```

## Create a Rule Type

```ts
import { NextResponse } from "next/server"

import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function POST(request: Request) {
  const pricingService = await initializePricingModule()
  const body = await request.json()

  const ruleTypes = await pricingService.createRuleTypes([
    {
      name: body.name,
      rule_attribute: body.rule_attribute,
    },
  ])

  return NextResponse.json({ rule_types: ruleTypes })
}
```

## Add Prices with Rules

```ts
import { NextResponse } from "next/server"

import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function POST(request: Request) {
  const pricingService = await initializePricingModule()
  const body = await request.json()

  const priceSet = await pricingService.addPrices({
    priceSetId: body.price_set_id,
    prices: [
     {
        amount: 500,
        currency_code: "USD",
        rules: {
          region_id: body.region_id
        },
      },
    ],
  })

  return NextResponse.json({ price_set: priceSet })
}
```

## Create a Currency

```ts
import { NextResponse } from "next/server"

import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function POST(request: Request) {
  const pricingService = await initializePricingModule()
  const body = await request.json()

  const currencies = await pricingService.createCurrencies([{
    code: "EUR",
    symbol: "€",
    symbol_native: "€",
    name: "Euro",
  }])

  return NextResponse.json({ currencies })
}
```

## List Currencies

```ts
import { NextResponse } from "next/server"

import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function GET(request: Request) {
  const pricingService = await initializePricingModule()

  const currencies = await pricingService.listCurrencies()

  return NextResponse.json({ currencies })
}
```

## Create Price List

```ts
import { NextResponse } from "next/server"

import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

export async function POST(request: Request) {
  const pricingService = await initializePricingModule()

  const priceLists = await pricingService.createPriceLists({
    title: "My Sale",
    type: "sale",
    starts_at: Date.parse("01/10/2023"),
    ends_at: Date.parse("31/10/2023"),
    rules: {
      region_id: ['DE', 'DK']
    },
    prices: [
      {
        amount: 400,
        currency_code: "EUR",
        price_set_id: priceSet.id,
      },
    ],
  })

  return NextResponse.json({ price_lists: priceLists })
}
```

## Calculate Prices For a Currency

```ts
import { NextResponse } from "next/server"

import {
  initialize as initializePricingModule,
} from "@medusajs/pricing"

type ContextType = {
  params: {
    id: string
    currency_code: string
  }
}

export async function GET(
  request: Request,
  { params }: ContextType
) {
  const pricingService = await initializePricingModule()

  const price = await pricingService.calculatePrices({
    id: [params.id],
  }, {
    context: {
      currency_code: params.currency_code,
    },
  })

  return NextResponse.json({ price })
}
```

---

## More Examples

The [module interface reference](../../references/pricing/interfaces/IPricingModuleService.mdx) provides a reference to all the methods available for use with examples for each.