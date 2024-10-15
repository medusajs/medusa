export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type Product = {
  __typename?: "Product"
  id?: Maybe<Scalars["String"]["output"]>
  title?: Maybe<Scalars["String"]["output"]>
  variants?: Maybe<Array<Maybe<ProductVariant>>>
}

export type ProductVariant = {
  __typename?: "ProductVariant"
  id?: Maybe<Scalars["String"]["output"]>
  product_id?: Maybe<Scalars["String"]["output"]>
  sku?: Maybe<Scalars["String"]["output"]>
  prices?: Maybe<Array<Maybe<Price>>>
}

export type Price = {
  __typename?: "Price"
  amount?: Maybe<Scalars["Int"]["output"]>
}

export interface FixtureEntryPoints {
  product_variant: ProductVariant
  product_variants: ProductVariant
  variant: ProductVariant
  variants: ProductVariant
  product: Product
  products: Product
  price: Price
  prices: Price
}

declare module "../index-service-entry-points" {
  interface IndexServiceEntryPoints extends FixtureEntryPoints {}
}
