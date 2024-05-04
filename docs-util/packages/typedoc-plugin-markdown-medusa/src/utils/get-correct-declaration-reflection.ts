import { DeclarationReflection } from "typedoc"
import { MarkdownTheme } from "../theme"

/**
 * Some reflections are loaded as objects rather than instances
 * of DeclarationReflection. This tries to reload the declaration reflection
 * if that's the case.
 */
export default function getCorrectDeclarationReflection(
  refl: unknown,
  theme: MarkdownTheme
): DeclarationReflection | undefined {
  if (
    refl &&
    !(refl instanceof DeclarationReflection) &&
    typeof refl === "object" &&
    "id" in refl &&
    refl.id
  ) {
    if (theme.reflection?.id === refl.id) {
      refl = theme.reflection!
    } else {
      refl =
        (theme.project?.getReflectionById(
          refl.id as number
        ) as DeclarationReflection) || refl
    }
  } else if (!refl && theme.reflection) {
    refl = theme.reflection
  }

  return refl as DeclarationReflection | undefined
}
