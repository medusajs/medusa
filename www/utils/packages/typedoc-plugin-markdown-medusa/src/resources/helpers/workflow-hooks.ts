import { MarkdownTheme } from "../../theme"
import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { cleanUpHookInput, getProjectChild } from "utils"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "workflowHooks",
    function (this: SignatureReflection): string {
      if (!this.parent?.documents || !theme.project) {
        return ""
      }

      const hooks = this.parent.documents.filter(
        (document) => document.comment?.modifierTags.has("@hook")
      )

      if (!hooks.length) {
        return ""
      }

      let str = `${Handlebars.helpers.titleLevel()} Hooks`

      Handlebars.helpers.incrementCurrentTitleLevel()

      const hooksTitleLevel = Handlebars.helpers.titleLevel()

      hooks.forEach((hook) => {
        // show the hook's input
        const hookReflection = getProjectChild(theme.project!, hook.name)

        if (
          !hookReflection ||
          !hookReflection.signatures?.length ||
          !hookReflection.signatures[0].parameters?.length
        ) {
          return
        }

        str += `\n\n${hooksTitleLevel} ${hook.name}\n\nHandlers consuming this hook accept the following input.\n\n`

        str += Handlebars.helpers.parameterComponent.call(
          cleanUpHookInput(hookReflection.signatures[0].parameters),
          {
            hash: {
              sectionTitle: hook.name,
            },
          }
        )
      })

      Handlebars.helpers.decrementCurrentTitleLevel()

      return str
    }
  )
}
