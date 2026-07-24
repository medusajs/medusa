import Handlebars from "handlebars"
import {
  Reflection,
  ReflectionKind,
  SignatureReflection,
  SourceReference,
} from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "sourceCodeLink",
    function (this: Reflection): string {
      let source: SourceReference | undefined

      switch (this.kind) {
        case ReflectionKind.GetSignature:
          if (this.parent instanceof SignatureReflection) {
            source = this.parent.sources?.[0]
          }
          break
        default:
          if ("sources" in this) {
            source = (this.sources as SourceReference[])?.[0]
          }
          break
      }

      if (!source?.url) {
        return ""
      }

      return `<SourceCodeLink link="${source.url}" />`
    }
  )
}
