type Separator = "_" | "-"

type FilterEmptyWord<
  Word,
  T extends unknown[],
  S extends "start" | "end"
> = Word extends ""
  ? T
  : {
      start: [Word, ...T]
      end: [...T, Word]
    }[S]

type SplitBySeparator<S> = S extends `${infer Word}${Separator}${infer Rest}`
  ? FilterEmptyWord<Word, SplitBySeparator<Rest>, "start">
  : FilterEmptyWord<S, [], "start">

type IsRepeatedSeparator<Ch, Validated> = Ch extends Separator
  ? Validated extends `${string}${Separator}`
    ? true
    : false
  : false

type RemoveRepeatedSeparator<
  NotValidated,
  Validated = ""
> = NotValidated extends `${infer Ch}${infer Rest}`
  ? IsRepeatedSeparator<Ch, Validated> extends true
    ? RemoveRepeatedSeparator<Rest, Validated>
    : RemoveRepeatedSeparator<Rest, `${Validated & string}${Ch}`>
  : Validated

type IsUppercase<Ch extends string> = [Ch] extends [Uppercase<Ch>]
  ? true
  : false

type SplitByCapital<
  S,
  Word extends string = "",
  Words extends unknown[] = []
> = S extends ""
  ? FilterEmptyWord<Word, Words, "end">
  : S extends `${infer Ch}${infer Rest}`
  ? IsUppercase<Ch> extends true
    ? SplitByCapital<Rest, Ch, FilterEmptyWord<Word, Words, "end">>
    : SplitByCapital<Rest, `${Word}${Ch}`, Words>
  : []

type WhichApproach<S> = S extends `${string}${Separator}${string}`
  ? "separatorBased"
  : "capitalBased"

type Words<S> = {
  separatorBased: SplitBySeparator<RemoveRepeatedSeparator<S>>
  capitalBased: IsUppercase<S & string> extends true ? [S] : SplitByCapital<S>
}[WhichApproach<S>]

type WordCase<S, C extends "pascal" | "lower"> = {
  pascal: Capitalize<WordCase<S, "lower"> & string>
  lower: Lowercase<S & string>
}[C]

type PascalCasify<T, R extends unknown[] = []> = T extends [
  infer Head,
  ...infer Rest
]
  ? PascalCasify<Rest, [...R, WordCase<Head, "pascal">]>
  : R

type CamelCasify<T> = T extends [infer Head, ...infer Rest]
  ? PascalCasify<Rest, [WordCase<Head, "lower">]>
  : []

type Join<T, S extends string = ""> = T extends [infer Word, ...infer Rest]
  ? Join<Rest, `${S}${Word & string}`>
  : S

export type CamelCase<S extends string> = Join<CamelCasify<Words<S>>>
