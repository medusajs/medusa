// TODO: The intent is to manage fields picking from a object, not to act upon at the moment and just keeping it here for reference.

import { Prettify } from "./common"

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S]

type NestedPickHelper<T, Path extends string[]> = Path extends [
  infer First,
  ...infer Rest
]
  ? First extends keyof T
    ? Rest extends string[]
      ? Rest["length"] extends 0
        ? T[First]
        : T[First] extends Array<infer Item>
        ? {
            [K in keyof Item as Rest[0] extends "*"
              ? K
              : K extends Rest[number]
              ? K
              : never]: Item[K] extends object
              ? NestedPickHelper<Item[K], Rest>
              : Item[K] extends Array<infer Item>
              ? NestedPickHelper<Item, Rest>
              : Rest[0] extends "*"
              ? Item[K]
              : K extends Rest[number]
              ? Item[K]
              : never
          }[]
        : T[First] extends object
        ? {
            [K in keyof T[First] as Rest[0] extends "*"
              ? K
              : K extends Rest[number]
              ? K
              : never]: T[First][K] extends object
              ? NestedPickHelper<T[First], Rest>
              : T[First][K] extends Array<infer Item>
              ? NestedPickHelper<Item, Rest>
              : Rest[0] extends "*"
              ? T[First][K]
              : K extends Rest[number]
              ? T[First][K]
              : never
          }
        : First extends "*"
        ? {
            [K in keyof T]: T[K]
          }
        : {
            [K in keyof T[First] as K extends Rest[number]
              ? K
              : never]: NestedPickHelper<T[First], Rest>
          }
      : never
    : First extends `${infer ArrayKey}[${infer Index}]`
    ? ArrayKey extends keyof T
      ? T[ArrayKey] extends (infer U)[]
        ? NestedPickHelper<U, Rest & string[]>
        : never
      : never
    : First extends "*"
    ? T
    : never
  : T

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I
) => void
  ? I
  : never

export type NestedPickFirstIteration<T, Props extends string[]> = {
  [P in Props[number] as Split<P, ".">[0] & string]: NestedPickHelper<
    T,
    Split<P, ".">
  >
}

type NestedPick<T, Props extends string[]> = {
  [K in keyof NestedPickFirstIteration<T, Props>]: Prettify<
    NestedPickFirstIteration<T, Props>[K] extends Array<infer V>
      ? UnionToIntersection<V>[]
      : UnionToIntersection<NestedPickFirstIteration<T, Props>[K]>
  >
}

type Obj = {
  id: string
  title: string
  variant: {
    id: string
    description: string
  }
  options: { id: string; value: string }[]
  extra: {
    detail: {
      name: string
      info: {
        data: string
      }
    }
  }
}

type Test = NestedPick<
  Obj,
  [
    "id",
    "variant.description",
    "variant.id",
    "options.id",
    "options.value",
    "extra.detail.info.data"
  ]
>

const test: Test = {
  id: "test",
  variant: {
    description: "test",
    id: "test",
  },
  options: [
    {
      id: "test",
      value: "test",
    },
  ],
  extra: {
    detail: {
      info: {
        data: "test",
      },
    },
  },
}
