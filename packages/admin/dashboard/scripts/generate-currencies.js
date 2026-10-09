async function generateCurrencies() {
  const { defaultCurrencies: currencies } = await import(
    "@medusajs/utils"
  )
  const fs = await import("fs")
  const path = await import("path")

  const record = Object.entries(currencies).reduce((acc, [key, values]) => {
    const code = values.code
    const symbol_native = values.symbol_native
    const name = values.name
    const decimal_digits = values.decimal_digits

    acc[key] = {
      code,
      name,
      symbol_native,
      decimal_digits,
    }

    return acc
  }, {})

  const json = JSON.stringify(record, null, 2)

  const dest = path.join(__dirname, "../src/lib/data/currencies.ts")
  const destDir = path.dirname(dest)

  const fileContent = `/** This file is auto-generated. Do not modify it manually. */\nexport type CurrencyInfo = {\n  code: string\n  name: string\n  symbol_native: string\n  decimal_digits: number\n}\n\nexport const currencies: Record<string, CurrencyInfo> = ${json}\n\nexport function getCurrencySymbol(code: string) {\n  return currencies[code.toUpperCase()].symbol_native\n}\n\nexport function getCurrencyDecimalDigits(code: string) {\n  return currencies[code.toUpperCase()].decimal_digits\n}`

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  fs.writeFileSync(dest, fileContent)
}

;(async () => {
  console.log("Generating currency info")
  try {
    await generateCurrencies()
    console.log("Currency info generated")
  } catch (e) {
    console.error(e)
  }
})()
