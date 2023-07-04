import { csvCellContentFormatter } from "../csv-cell-content-formatter"

type Case = {
  str: string
  expected: string
}

const cases: [string, Case][] = [
  [
    "should return a the exact input content",
    {
      str: "Hello my name is Adrien and I like writing single line content.",
      expected:
        'Hello my name is Adrien and I like writing single line content.',
    },
  ],
  [
    "should return a formatted string escaping the coma",
    {
      str: "Hello, my name is Adrien and I like writing single line content.",
      expected:
        '"Hello, my name is Adrien and I like writing single line content."',
    },
  ],
  [
    "should return a formatted string escaping the semicolon",
    {
      str: "Hello; my name is Adrien and I like writing single line content.",
      expected:
        '"Hello; my name is Adrien and I like writing single line content."',
    },
  ],
  [
    "should return a formatted string escaping new line when there is new line chars",
    {
      str: `Hello,
my name is Adrien and
I like writing multiline content
in a template string`,
      expected:
        '"Hello,\nmy name is Adrien and\nI like writing multiline content\nin a template string"',
    },
  ],
  [
    "should return a formatted string escaping new line when there is new line chars and escape the double quote when there is double quotes",
    {
      str: 'Hello,\nmy name is "Adrien" and\nI like writing multiline content\nin a string',
      expected:
        '"Hello,\nmy name is ""Adrien"" and\nI like writing multiline content\nin a string"',
    },
  ],
]

describe("csvCellContentFormatter", function () {
  it.each(cases)("%s", (title: string, { str, expected }: Case) => {
    const formattedStr = csvCellContentFormatter(str)
    expect(formattedStr).toBe(expected)
  })
})
