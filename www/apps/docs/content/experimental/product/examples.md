# Examples of Product Module

In this document, you’ll find common examples of how you can use the Product module in your application.

:::note

Examples in this section are in the context of a Next.js App Router.

:::

## Create Product

```ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function POST(request: Request) {
  const productService = await initializeProductModule()

  const products = await productService.create([
    {
      title: "Medusa Shirt",
      options: [
        {
          title: "Color",
        },
      ],
      variants: [
        {
          title: "Black Shirt",
          options: [
            {
              value: "Black",
            },
          ],
        },
      ],
    },
  ])

  return NextResponse.json({ products })
}
```

## List Products

```ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(request: Request) {
  const productService = await initializeProductModule()

  const data = await productService.list()

  return NextResponse.json({ products: data })
}
```

## Retrieve a Product by its ID

```ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(
  request: Request, 
  { params }: { params: Record<string, any> }) {
  
  const { id } = params
  const productService = await initializeProductModule()

  const data = await productService.list({
    id,
  })

  return NextResponse.json({ product: data[0] })
}
```

## Retrieve a Product by its Handle

```ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(
  request: Request, 
  { params }: { params: Record<string, any> }) {
  
  const { handle } = params
  const productService = await initializeProductModule()

  const data = await productService.list({
    handle,
  })

  return NextResponse.json({ product: data[0] })
}
```

## Retrieve Categories

```ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(request: Request) {
  const productService = await initializeProductModule()

  const data = await productService.listCategories()

  return NextResponse.json({ categories: data })
}
```

## Retrieve Category by Handle

```ts
import { NextResponse } from "next/server"

import { 
  initialize as initializeProductModule,
} from "@medusajs/product"

export async function GET(
  request: Request, 
  { params }: { params: Record<string, any> }) {
  
  const { handle } = params
  const productService = await initializeProductModule()

  const data = await productService.listCategories({
    handle,
  })

  return NextResponse.json({ category: data[0] })
}
```

---

## More Examples

The [module interface reference](../../references/product/interfaces/IProductModuleService.mdx) provides a reference to all the methods available for use with examples for each.
