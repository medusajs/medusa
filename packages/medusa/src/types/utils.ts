/**
 * Utility type used to remove some optional attributes (coming from K) from a type T
 */
export type WithRequiredProperty<T, K extends keyof T> = T &
  {
    // ?- removes 'optional' from a property
    [Property in K]-?: T[Property]
  }
