import { normalizeLocale } from "../normalize-locale"

describe("normalizeLocale", function () {
  it("should normalize single segment locales to lowercase", function () {
    const expectations = [
      {
        input: "eN",
        output: "en",
      },
      {
        input: "EN",
        output: "en",
      },
      {
        input: "En",
        output: "en",
      },
      {
        input: "en",
        output: "en",
      },
      {
        input: "fr",
        output: "fr",
      },
      {
        input: "FR",
        output: "fr",
      },
      {
        input: "de",
        output: "de",
      },
    ]

    expectations.forEach((expectation) => {
      expect(normalizeLocale(expectation.input)).toEqual(expectation.output)
    })
  })

  it("should normalize two segment locales (language-region)", function () {
    const expectations = [
      {
        input: "en-Us",
        output: "en-US",
      },
      {
        input: "EN-US",
        output: "en-US",
      },
      {
        input: "en-us",
        output: "en-US",
      },
      {
        input: "En-Us",
        output: "en-US",
      },
      {
        input: "fr-FR",
        output: "fr-FR",
      },
      {
        input: "FR-fr",
        output: "fr-FR",
      },
      {
        input: "de-DE",
        output: "de-DE",
      },
      {
        input: "es-ES",
        output: "es-ES",
      },
      {
        input: "pt-BR",
        output: "pt-BR",
      },
    ]

    expectations.forEach((expectation) => {
      expect(normalizeLocale(expectation.input)).toEqual(expectation.output)
    })
  })

  it("should normalize three segment locales (language-script-region)", function () {
    const expectations = [
      {
        input: "RU-cYrl-By",
        output: "ru-Cyrl-BY",
      },
      {
        input: "ru-cyrl-by",
        output: "ru-Cyrl-BY",
      },
      {
        input: "RU-CYRL-BY",
        output: "ru-Cyrl-BY",
      },
      {
        input: "zh-Hans-CN",
        output: "zh-Hans-CN",
      },
      {
        input: "ZH-HANS-CN",
        output: "zh-Hans-CN",
      },
      {
        input: "sr-Latn-RS",
        output: "sr-Latn-RS",
      },
      {
        input: "SR-LATN-RS",
        output: "sr-Latn-RS",
      },
    ]

    expectations.forEach((expectation) => {
      expect(normalizeLocale(expectation.input)).toEqual(expectation.output)
    })
  })

  it("should return locale as-is for more than three segments", function () {
    const expectations = [
      {
        input: "en-US-x-private",
        output: "en-US-x-private",
      },
      {
        input: "en-US-x-private-extended",
        output: "en-US-x-private-extended",
      },
      {
        input: "en-US-x-private-extended-more",
        output: "en-US-x-private-extended-more",
      },
    ]

    expectations.forEach((expectation) => {
      expect(normalizeLocale(expectation.input)).toEqual(expectation.output)
    })
  })

  it("should handle edge cases", function () {
    const expectations = [
      {
        input: "",
        output: "",
      },
      {
        input: "a",
        output: "a",
      },
      {
        input: "A",
        output: "a",
      },
      {
        input: "a-B",
        output: "a-B",
      },
      {
        input: "a-b-C",
        output: "a-B-C",
      },
    ]

    expectations.forEach((expectation) => {
      expect(normalizeLocale(expectation.input)).toEqual(expectation.output)
    })
  })
})
