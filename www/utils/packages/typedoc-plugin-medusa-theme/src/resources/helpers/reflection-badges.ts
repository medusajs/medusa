import Handlebars from "handlebars"
import { DeclarationReflection } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "reflectionBadges",
    function (this: DeclarationReflection) {
      const badges: {
        variant: string
        children: string
        [k: string]: string
      }[] = []

      // TODO maybe support more badges
      const isOptional =
        this.flags.isOptional ||
        this.signatures?.some((s) => s.flags.isOptional)
      if (isOptional) {
        badges.push({
          variant: "neutral",
          children: "optional",
        })
      }

      if (!badges.length) {
        return ""
      }

      return `<BadgesList badges={${JSON.stringify(
        badges,
        null,
        2
      )}} className="mb-1" />`
    }
  )
}
