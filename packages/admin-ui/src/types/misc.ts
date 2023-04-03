export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends ReadonlyArray<infer V>
    ? ReadonlyArray<DeepPartial<V>>
    : DeepPartial<T[P]>
}

export type Base<T extends string> = `/${T}/`
