import pkg from "js-beautify"

const { js_beautify } = pkg

export default function beautifyCode(code: string): string {
  const beautifyOptions: pkg.JSBeautifyOptions = {
    indent_size: 2,
    brace_style: "preserve-inline",
    wrap_line_length: 80,
  }

  return js_beautify(code, beautifyOptions)
}
