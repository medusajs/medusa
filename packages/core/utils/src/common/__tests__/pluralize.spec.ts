import type { Pluralize } from "@medusajs/types"
import { expectTypeOf } from "expect-type"
import { pluralize } from "../plurailze"

describe("pluralize", function () {
  it("should pluralize any words", function () {
    const words = [
      "apple",
      "box",
      "day",
      "country",
      "baby",
      "knife",
      "hero",
      "potato",
      "address",
      "info",
    ]

    const expectedOutput = [
      "apples",
      "boxes",
      "days",
      "countries",
      "babies",
      "knives",
      "heroes",
      "potatoes",
      "addresses",
      "info",
    ]

    words.forEach((word, index) => {
      expect(pluralize(word)).toBe(expectedOutput[index])
    })
  })

  it("should pluralize words ending in 'o' with the same result as the Pluralize type", function () {
    expect(pluralize("video")).toBe("videos")
    expectTypeOf<Pluralize<"video">>().toEqualTypeOf<"videos">()

    expect(pluralize("photo")).toBe("photos")
    expectTypeOf<Pluralize<"photo">>().toEqualTypeOf<"photos">()

    expect(pluralize("egreso")).toBe("egresos")
    expectTypeOf<Pluralize<"egreso">>().toEqualTypeOf<"egresos">()

    expect(pluralize("socio")).toBe("socios")
    expectTypeOf<Pluralize<"socio">>().toEqualTypeOf<"socios">()

    expect(pluralize("hero")).toBe("heroes")
    expectTypeOf<Pluralize<"hero">>().toEqualTypeOf<"heroes">()

    expect(pluralize("potato")).toBe("potatoes")
    expectTypeOf<Pluralize<"potato">>().toEqualTypeOf<"potatoes">()

    expect(pluralize("echo")).toBe("echoes")
    expectTypeOf<Pluralize<"echo">>().toEqualTypeOf<"echoes">()

    expect(pluralize("volcano")).toBe("volcanoes")
    expectTypeOf<Pluralize<"volcano">>().toEqualTypeOf<"volcanoes">()
  })
})
