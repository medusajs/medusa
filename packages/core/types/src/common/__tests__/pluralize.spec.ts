import { expectTypeOf } from "expect-type"
import { Pluralize } from "../common"

describe("Pluralize", () => {
  test("pluralize uncountable nouns", () => {
    expectTypeOf<Pluralize<"media">>().toEqualTypeOf<"media">()
    expectTypeOf<Pluralize<"Media">>().toEqualTypeOf<"Media">()
    expectTypeOf<Pluralize<"you">>().toEqualTypeOf<"you">()
    expectTypeOf<Pluralize<"sheep">>().toEqualTypeOf<"sheep">()
    expectTypeOf<Pluralize<"series">>().toEqualTypeOf<"series">()
    expectTypeOf<Pluralize<"species">>().toEqualTypeOf<"species">()
    expectTypeOf<Pluralize<"deer">>().toEqualTypeOf<"deer">()
    expectTypeOf<Pluralize<"info">>().toEqualTypeOf<"info">()
  })

  test("pluralize words ending with fe", () => {
    expectTypeOf<Pluralize<"wife">>().toEqualTypeOf<"wives">()
    expectTypeOf<Pluralize<"knife">>().toEqualTypeOf<"knives">()
  })

  test("pluralize words ending with ch", () => {
    expectTypeOf<Pluralize<"church">>().toEqualTypeOf<"churches">()
    expectTypeOf<Pluralize<"arch">>().toEqualTypeOf<"arches">()
  })

  test("pluralize words ending with o", () => {
    expectTypeOf<Pluralize<"hero">>().toEqualTypeOf<"heroes">()
  })

  test("pluralize words ending with ch", () => {
    expectTypeOf<Pluralize<"watch">>().toEqualTypeOf<"watches">()
  })

  test("pluralize words ending with z", () => {
    expectTypeOf<Pluralize<"fiz">>().toEqualTypeOf<"fizes">()
  })

  test("pluralize words ending with y, in which y follows a constant", () => {
    expectTypeOf<Pluralize<"puppy">>().toEqualTypeOf<"puppies">()
    expectTypeOf<Pluralize<"twenty">>().toEqualTypeOf<"twenties">()
    expectTypeOf<Pluralize<"copy">>().toEqualTypeOf<"copies">()
  })

  test("pluralize words ending with y, in which y follow a vowel", () => {
    expectTypeOf<Pluralize<"play">>().toEqualTypeOf<"plays">()
    expectTypeOf<Pluralize<"relay">>().toEqualTypeOf<"relays">()
    expectTypeOf<Pluralize<"alley">>().toEqualTypeOf<"alleys">()
    expectTypeOf<Pluralize<"alley">>().toEqualTypeOf<"alleys">()
    expectTypeOf<Pluralize<"boy">>().toEqualTypeOf<"boys">()
    expectTypeOf<Pluralize<"enjoy">>().toEqualTypeOf<"enjoys">()
    expectTypeOf<Pluralize<"buy">>().toEqualTypeOf<"buys">()
  })

  test("pluralize words with special rules", () => {
    expectTypeOf<Pluralize<"person">>().toEqualTypeOf<"people">()
    expectTypeOf<Pluralize<"child">>().toEqualTypeOf<"children">()
    expectTypeOf<Pluralize<"man">>().toEqualTypeOf<"men">()
    expectTypeOf<Pluralize<"criterion">>().toEqualTypeOf<"criteria">()
    expectTypeOf<Pluralize<"tooth">>().toEqualTypeOf<"teeth">()
    expectTypeOf<Pluralize<"foot">>().toEqualTypeOf<"feet">()
  })

  test("pluralize compound words ending with info", () => {
    expectTypeOf<
      Pluralize<"CountryCompanyInfo">
    >().toEqualTypeOf<"CountryCompanyInfos">()
    expectTypeOf<Pluralize<"SoftInfo">>().toEqualTypeOf<"SoftInfos">()
  })

  test("pluralize common words with suffix false positives", () => {
    expectTypeOf<Pluralize<"Price">>().toEqualTypeOf<"Prices">()
    expectTypeOf<Pluralize<"Email">>().toEqualTypeOf<"Emails">()
    expectTypeOf<Pluralize<"Metadata">>().toEqualTypeOf<"Metadatas">()
  })
})
