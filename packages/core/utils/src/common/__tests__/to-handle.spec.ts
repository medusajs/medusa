import { toHandle } from "../to-handle"
import { isValidHandle } from "../validate-handle"

describe("toHandle and isValidHandle", function () {
  it("should generate URL friendly handles", function () {
    const expectations = [
      // English / Latin
      { input: "hello-world", output: "hello-world" },
      { input: "Hello-World", output: "hello-world" },
      { input: "HELLO-WORLD", output: "hello-world" },
      { input: "my-article-123", output: "my-article-123" },
      { input: "what-s-up", output: "what-s-up" },
      { input: "don-t-stop", output: "don-t-stop" },
      { input: "café-resume", output: "café-resume" },
      { input: "naïve-approach", output: "naïve-approach" },
      { input: "über-cool", output: "über-cool" },
      { input: "straße-münchen", output: "strasse-münchen" },
      { input: "a-1", output: "a-1" },
      { input: "123", output: "123" },
      { input: "123-456", output: "123-456" },

      // Special characters removal
      { input: "-leading-hyphen", output: "leading-hyphen" },
      { input: "trailing-hyphen-", output: "trailing-hyphen" },
      { input: "double--hyphen", output: "double-hyphen" },
      { input: "multiple---hyphens", output: "multiple-hyphens" },
      { input: "the-fan-boy's-club", output: "the-fan-boys-club" },
      { input: "@t-the-sky", output: "t-the-sky" },
      { input: "user.product", output: "userproduct" },
      { input: 'sky"bar', output: "skybar" },
      { input: "test space", output: "test-space" },
      { input: "test_underscore", output: "test-underscore" },
      { input: "test@email", output: "testemail" },
      { input: "hello!!!world", output: "helloworld" },
      { input: "price$99", output: "price99" },
      { input: "100%", output: "100" },

      // Edge Cases
      { input: "hello world", output: "hello-world" },
      { input: "hello  world", output: "hello-world" },
      { input: "hello_world", output: "hello-world" },
      { input: "hello__world", output: "hello-world" },
      { input: "hello - world", output: "hello-world" },
      { input: "hello _ world", output: "hello-world" },
      { input: "hello/world", output: "helloworld" }, // forward slash
      { input: "hello:world", output: "helloworld" }, // colon
      { input: "hello?world", output: "helloworld" }, // question mark
      { input: "hello#world", output: "helloworld" }, // hash
      { input: "hello&world", output: "helloworld" }, // ampersand
      { input: "hello=world", output: "helloworld" }, // equals
      { input: "hello+world", output: "helloworld" }, // plus
      { input: "hello,world", output: "helloworld" }, // comma
      { input: "hello;world", output: "helloworld" }, // semicolon
      { input: "hello(world)", output: "helloworld" }, // parentheses
      { input: "hello[world]", output: "helloworld" }, // brackets
      { input: "hello{world}", output: "helloworld" }, // braces
      { input: "hello|world", output: "helloworld" }, // pipe
      { input: "hello\\world", output: "helloworld" }, // backslash
      { input: "hello`world", output: "helloworld" }, // backtick
      { input: "hello~world", output: "helloworld" }, // tilde
      { input: "hello*world", output: "helloworld" }, // asterisk
      { input: "hello^world", output: "helloworld" }, // caret
      { input: "hello<world>", output: "helloworld" }, // angle brackets

      // Persian / Farsi
      { input: "سلام-دنیا", output: "سلام-دنیا" },
      { input: "فارسی-۱۲۳", output: "فارسی-۱۲۳" },
      { input: "کتاب-خوب", output: "کتاب-خوب" },
      { input: "مردم-آزاد", output: "مردم-آزاد" },
      { input: "نوروز  ۱۴۰۲", output: "نوروز-۱۴۰۲" },
      { input: "ایران_زمین", output: "ایران-زمین" },
      { input: "گل  های  زیبا", output: "گل-های-زیبا" },
      { input: "مردم@آزاد", output: "مردمآزاد" },

      // Arabic
      { input: "مرحبا-بالعالم", output: "مرحبا-بالعالم" },
      { input: "السلام-عليكم", output: "السلام-عليكم" },
      { input: "كتاب-جديد", output: "كتاب-جديد" },
      { input: "السلام_عليكم", output: "السلام-عليكم" },
      { input: "كتاب جديد", output: "كتاب-جديد" },
      { input: "قرآن__كريم", output: "قرآن-كريم" },
      { input: "قهوة!!عربية", output: "قهوةعربية" },

      // Hebrew
      { input: "שלום-עולם", output: "שלום-עולם" },
      { input: "עברית-שפה", output: "עברית-שפה" },
      { input: "ספר-חדש", output: "ספר-חדש" },
      { input: "עברית שפה", output: "עברית-שפה" },
      { input: "ספר__חדש", output: "ספר-חדש" },
      { input: "ירושלים!!הבירה", output: "ירושליםהבירה" },

      // Japanese
      { input: "こんにちは-世界", output: "こんにちは-世界" },
      { input: "コンニチハ-セカイ", output: "コンニチハ-セカイ" },
      { input: "日本語-勉強", output: "日本語-勉強" },
      { input: "コンニチハ セカイ", output: "コンニチハ-セカイ" },
      { input: "日本語__勉強", output: "日本語-勉強" },
      { input: "東京@@タワー", output: "東京タワー" },

      // Chinese
      { input: "你好-世界", output: "你好-世界" },
      { input: "北京-欢迎你", output: "北京-欢迎你" },
      { input: "中国-文化", output: "中国-文化" },
      { input: "北京 欢迎你", output: "北京-欢迎你" },
      { input: "中国__文化", output: "中国-文化" },
      { input: "美食!!天下", output: "美食天下" },

      // Korean
      { input: "안녕하세요-세계", output: "안녕하세요-세계" },
      { input: "한국어-공부", output: "한국어-공부" },
      { input: "서울-특별시", output: "서울-특별시" },
      { input: "한국어 공부", output: "한국어-공부" },
      { input: "서울__특별시", output: "서울-특별시" },
      { input: "김치@@찌개", output: "김치찌개" },

      // Russian
      { input: "привет-мир", output: "привет-мир" },
      { input: "русский-язык", output: "русский-язык" },
      { input: "москва-столица", output: "москва-столица" },
      { input: "русский язык", output: "русский-язык" },
      { input: "Москва__столица", output: "москва-столица" },
      { input: "добро пожаловать", output: "добро-пожаловать" },
      { input: "спасибо!!большое", output: "спасибобольшое" },

      // Mixed languages
      { input: "hello привет 世界", output: "hello-привет-世界" },
      { input: "café 北京 123", output: "café-北京-123" },
      { input: "東京 123 abc", output: "東京-123-abc" },
      { input: "straße москва 서울", output: "strasse-москва-서울" },
      { input: "user@123!مرحبا", output: "user123مرحبا" },

      // Greek
      { input: "αβγ-δεζ", output: "αβγ-δεζ" },
      { input: "καλημερα-κοσμε", output: "καλημερα-κοσμε" },
      { input: "ΚΑΛΗΜΕΡΑ__ΚΟΣΜΕ", output: "καλημερα-κοσμε" },

      // Armenian
      { input: "բարեւ-աշխարհ", output: "բարեւ-աշխարհ" },

      // Georgian
      { input: "გამარჯობა-სამყარო", output: "გამარჯობა-სამყარო" },

      // Edge cases
      { input: "hello\nworld", output: "hello-world" },
      { input: "hello\tworld", output: "hello-world" },
      { input: "a", output: "a" },
      { input: "1", output: "1" },
      { input: "-a-", output: "a" },
      { input: "---a---b---", output: "a-b" },

      // Emoji and special Unicode
      { input: "hello😀world", output: "helloworld" }, // emoji
      { input: "hello→world", output: "helloworld" }, // arrows
      { input: "hello★world", output: "helloworld" }, // stars
      { input: "hello™world", output: "helloworld" }, // symbols

      // Zero-width characters
      { input: "hello\u200Bworld", output: "helloworld" }, // zero-width space
      { input: "hello\u200Cworld", output: "helloworld" }, // zero-width non-joiner

      // Mixed scripts with special chars
      { input: "hello@привет#世界", output: "helloпривет世界" },
    ]

    const failures: Array<{ input: string; expected: any; received: any }> = []

    expectations.forEach(({ input, output }) => {
      const handle = toHandle(input)

      if (handle !== output) {
        failures.push({
          input,
          expected: output,
          received: handle,
        })
      }
    })

    if (failures.length > 0) {
      throw new Error(
        `Found ${failures.length} failing test case(s):\n\n` +
        failures
          .map(
            (f) =>
              `  "${f.input}" → expected "${f.expected}", got "${f.received}"`
          )
          .join("\n") +
        `\n\nTotal: ${expectations.length} test cases, ${failures.length} failed`
      )
    }

    expect(expectations.length).toBeGreaterThan(0)
  })

  it("should validate cleaned handles", function () {
    // All cleaned outputs should be valid handles
    const handles = [
      "hello-world",
      "cafe-resume",
      "strasse-munchen",
      "سلام-دنیا",
      "你好-世界",
      "안녕하세요-세계",
      "привет-мир",
      "αβγ-δεζ",
      "a",
      "1",
      "a-1-b-2",
    ]

    handles.forEach((handle) => {
      expect(isValidHandle(handle)).toBe(true)
    })

    // These should be invalid
    expect(isValidHandle("")).toBe(false)
    expect(isValidHandle("-")).toBe(false)
    expect(isValidHandle("hello--world")).toBe(false)
    expect(isValidHandle("-hello")).toBe(false)
    expect(isValidHandle("hello-")).toBe(false)
  })

  it("should generate fallback handles for empty or invalid inputs", () => {
    // Empty string should generate fallback
    const result1 = toHandle("")
    expect(result1).toMatch(/^product-[a-z0-9]{6}$/)
    expect(isValidHandle(result1)).toBe(true)

    // Only special characters should generate fallback
    const result2 = toHandle("-")
    expect(result2).toMatch(/^product-[a-z0-9]{6}$/)
    expect(isValidHandle(result2)).toBe(true)

    const result3 = toHandle("--")
    expect(result3).toMatch(/^product-[a-z0-9]{6}$/)
    expect(isValidHandle(result3)).toBe(true)

    // Only spaces/underscores should generate fallback
    const result4 = toHandle("   ")
    expect(result4).toMatch(/^product-[a-z0-9]{6}$/)
    expect(isValidHandle(result4)).toBe(true)

    const result5 = toHandle("___")
    expect(result5).toMatch(/^product-[a-z0-9]{6}$/)
    expect(isValidHandle(result5)).toBe(true)

    // Only special characters should generate fallback
    const result6 = toHandle("@#$%")
    expect(result6).toMatch(/^product-[a-z0-9]{6}$/)
    expect(isValidHandle(result6)).toBe(true)
  })

  it("should ensure fallback handles are unique (called multiple times)", () => {
    const handles = new Set()
    for (let i = 0; i < 10; i++) {
      const handle = toHandle("")
      handles.add(handle)
    }
    // Should have multiple unique handles (very unlikely to have collisions)
    expect(handles.size).toBeGreaterThan(1)
  })
})

it("should produce handles that isValidHandle accepts (invariant)", () => {
  const titles = [
    // Japanese modifier letters
    "ラーメン", // prolonged sound mark ー
    "様々", // iteration mark 々
    "コーヒー", // coffee
    "サーバー", // server
    "人々", // people
    "時々", // sometimes
    "さまざま", // various
    // Other scripts
    "کتاب فارسی",
    "الكتاب العربي",
    "我的产品",
    "안녕하세요",
    "привет мир",
    "café",
    "straße",
  ]

  titles.forEach((title) => {
    const handle = toHandle(title)
    const isValid = isValidHandle(handle)
    expect(isValid).toBe(true)
  })
})
