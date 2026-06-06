import outdent from "outdent"
import { generateModule } from "../utils"
import { generateI18n } from "../i18n"

export async function generateVirtualI18nModule(
    sources: Set<string>,
    pluginMode = false
) {
    const i18n = await generateI18n(sources)

    const imports = [
        'import { deepMerge } from "@zjedene-medusa/admin-shared"',
        ...i18n.imports
    ]

    const code = outdent`
        ${imports.join("\n")}

        ${pluginMode
            ? `const i18nModule = { ${i18n.code} }`
            : `export default { ${i18n.code} }`
        }
    `

    return generateModule(code)
}

