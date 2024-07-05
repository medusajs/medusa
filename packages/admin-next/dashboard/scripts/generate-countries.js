async function generateCountries() {
  const { countries } = await import("@medusajs/medusa/dist/utils/countries.js")
  const fs = await import("fs")
  const path = await import("path")

  const arr = countries.map((c) => {
    const iso_2 = c.alpha2.toLowerCase()
    const iso_3 = c.alpha3.toLowerCase()
    const num_code = parseInt(c.numeric, 10)
    const name = c.name.toUpperCase()
    const display_name = c.name

    return {
      iso_2,
      iso_3,
      num_code,
      name,
      display_name,
    }
  })

  const json = JSON.stringify(arr, null, 2)

  const dest = path.join(__dirname, "../src/lib/countries.ts")
  const destDir = path.dirname(dest)

  const fileContent = `/** This file is auto-generated. Do not modify it manually. */\nimport type { RegionCountryDTO } from "@medusajs/types"\n\nexport const countries: Omit<RegionCountryDTO, "id">[] = ${json}`

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  fs.writeFileSync(dest, fileContent)
}

;(async () => {
  console.log("Generating countries")
  try {
    await generateCountries()
    console.log("Countries generated")
  } catch (e) {
    console.error(e)
  }
})()
