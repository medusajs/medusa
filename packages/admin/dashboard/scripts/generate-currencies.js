async function generateCurrencies() {
  const { currencies } = await import(
    "@medusajs/medusa/dist/utils/currencies.js"
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

  const dest = path.join(__dirname, "../src/lib/currencies.ts")
  const destDir = path.dirname(dest)

  const fileContent = `/** This file is auto-generated. Do not modify it manually. */\ntype CurrencyInfo = { code: string; name: string; symbol_native: string; decimal_digits: number }\n\nexport const currencies: Record<string, CurrencyInfo> = ${json}`

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
