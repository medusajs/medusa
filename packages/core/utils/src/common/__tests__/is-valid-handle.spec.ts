import { isValidHandle } from "../validate-handle"

describe("isValidHandle", function () {
  it("should validate URL-friendly handles across all languages", function () {
    const expectations = [
      // English / Latin - valid cases
      { input: "hello-world", isValid: true },
      { input: "my-article-123", isValid: true },
      { input: "a-1", isValid: true },
      { input: "123", isValid: true },
      { input: "123-456", isValid: true },
      { input: "café-resume", isValid: true },
      { input: "über-cool", isValid: true },

      // English / Latin - invalid cases
      { input: "-leading-hyphen", isValid: false },
      { input: "trailing-hyphen-", isValid: false },
      { input: "double--hyphen", isValid: false },
      { input: "", isValid: false },
      { input: "the-fan-boy's-club", isValid: false },
      { input: "@t-the-sky", isValid: false },
      { input: "user.product", isValid: false },
      { input: 'sky"bar', isValid: false },
      { input: "test space", isValid: false },
      { input: "test_underscore", isValid: false },
      { input: "test@email", isValid: false },
      { input: "hello!!!world", isValid: false },
      { input: "price$99", isValid: false },
      { input: "100%", isValid: false },
      { input: "Hello-World", isValid: false },
      { input: "MyProduct", isValid: false },
      { input: "PRODUCT-123", isValid: false },
      { input: "Product-Name", isValid: false },

      // Persian / Farsi
      { input: "سلام-دنیا", isValid: true },
      { input: "فارسی-۱۲۳", isValid: true },
      { input: "کتاب-خوب", isValid: true },
      { input: "مردم-آزاد", isValid: true },

      // Arabic
      { input: "مرحبا-بالعالم", isValid: true },
      { input: "السلام-عليكم", isValid: true },
      { input: "كتاب-جديد", isValid: true },

      // Hebrew
      { input: "שלום-עולם", isValid: true },
      { input: "עברית-שפה", isValid: true },
      { input: "ספר-חדש", isValid: true },

      // Japanese
      { input: "こんにちは-世界", isValid: true },
      { input: "コンニチハ-セカイ", isValid: true },
      { input: "日本語-勉強", isValid: true },

      // Chinese
      { input: "你好-世界", isValid: true },
      { input: "北京-欢迎你", isValid: true },
      { input: "中国-文化", isValid: true },

      // Korean
      { input: "안녕하세요-세계", isValid: true },
      { input: "한국어-공부", isValid: true },
      { input: "서울-특별시", isValid: true },

      // Turkish
      { input: "istanbul-sehir", isValid: true },
      { input: "turkce-dil", isValid: true },
      { input: "ılık-sut", isValid: true },

      // Russian
      { input: "привет-мир", isValid: true },
      { input: "русский-язык", isValid: true },
      { input: "москва-столица", isValid: true },

      // Greek
      { input: "αβγ-δεζ", isValid: true },
      { input: "καλημερα-κοσμε", isValid: true },

      // Edge cases
      { input: "a", isValid: true },
      { input: "1", isValid: true },
      { input: "-", isValid: false },
      { input: "--", isValid: false },
      { input: "   ", isValid: false },
      { input: "hello\nworld", isValid: false },
      { input: "hello\tworld", isValid: false },

      // Multiple segments
      { input: "a-b-c-d-e", isValid: true },
      { input: "123-456-789", isValid: true },
      { input: "a-1-b-2-c-3", isValid: true },

      // Case-less scripts (Persian, Arabic, Japanese, Chinese)
      { input: "کتاب-فارسی", isValid: true },
      { input: "الكتاب-العربي", isValid: true },
      { input: "私の-製品", isValid: true },
      { input: "我的-产品", isValid: true },
    ]

    const failures: Array<{
      input: string
      expected: boolean
      received: boolean
    }> = []

    expectations.forEach((expectation) => {
      const result = isValidHandle(expectation.input)
      if (result !== expectation.isValid) {
        failures.push({
          input: expectation.input,
          expected: expectation.isValid,
          received: result,
        })
      }
    })

    // If there are failures, show them all at once
    if (failures.length > 0) {
      throw new Error(
        `Found ${failures.length} failing test case(s):\n` +
          failures
            .map(
              (f) =>
                `  "${f.input}" → expected ${f.expected}, got ${f.received}`
            )
            .join("\n")
      )
    }

    // All passed - verify count
    expect(expectations.length).toBeGreaterThan(0)
  })

  it("should handle very long slugs", function () {
    const longSlug = "a".repeat(100)
    expect(isValidHandle(longSlug)).toEqual(true)

    const longSlugWithHyphens = Array(50).fill("segment").join("-")
    expect(isValidHandle(longSlugWithHyphens)).toEqual(true)
  })

  it("should reject empty strings", function () {
    expect(isValidHandle("")).toEqual(false)
  })

  it("should reject slugs with special characters", function () {
    const specialChars = [
      "test!slug",
      "test@slug",
      "test#slug",
      "test$slug",
      "test%slug",
      "test^slug",
      "test&slug",
      "test*slug",
      "test(slug",
      "test)slug",
      "test+slug",
      "test=slug",
      "test[slug",
      "test]slug",
      "test{slug",
      "test}slug",
      "test|slug",
      "test\\slug",
      "test:slug",
      "test;slug",
      "test'slug",
      'test"slug',
      "test<slug",
      "test>slug",
      "test,slug",
      "test.slug",
      "test/slug",
      "test?slug",
      "test`slug",
      "test~slug",
    ]

    const failures: string[] = []

    specialChars.forEach((slug) => {
      if (isValidHandle(slug) !== false) {
        failures.push(slug)
      }
    })

    if (failures.length > 0) {
      throw new Error(
        `These special character slugs should be invalid but passed validation:\n` +
          failures.map((f) => `  "${f}"`).join("\n")
      )
    }

    expect(specialChars.length).toBeGreaterThan(0)
  })

  it("should reject slugs with unicode special characters", function () {
    const unicodeSpecialChars = [
      "test→slug",
      "test←slug",
      "test↑slug",
      "test↓slug",
      "test↔slug",
      "test⇒slug",
      "test⇐slug",
      "test★slug",
      "test♥slug",
      "test♦slug",
      "test♣slug",
      "test♠slug",
      "test●slug",
      "test○slug",
      "test■slug",
      "test□slug",
      "test▲slug",
      "test△slug",
    ]

    const failures: string[] = []

    unicodeSpecialChars.forEach((slug) => {
      if (isValidHandle(slug) !== false) {
        failures.push(slug)
      }
    })

    if (failures.length > 0) {
      throw new Error(
        `These unicode special character slugs should be invalid but passed validation:\n` +
          failures.map((f) => `  "${f}"`).join("\n")
      )
    }

    expect(unicodeSpecialChars.length).toBeGreaterThan(0)
  })
})
