import {
  Application,
  Comment,
  Context,
  Converter,
  ReflectionKind,
  SignatureReflection,
  TypeScript as ts,
} from "typedoc"

let isPatched = false

/**
 * Restores how TypeDoc 0.27 converted symbols:
 *
 * - `@function` on variables with call signatures, such as
 *   `createWorkflow(...)` exports. 0.28 only converts a variable as a function
 *   if it's initialized with a function expression.
 * - `@primaryExport` on `export * as X` namespaces, such as `HttpTypes`. 0.28
 *   defers their members, so a module's flat `export *` of the same symbols
 *   takes the declarations and the namespace is left empty.
 * - Variable-functions keep their comment on both the declaration and its
 *   signatures. 0.28 moves it to the signature, so the declaration loses tags
 *   like `@example`.
 */
export function load(app: Application) {
  app.converter.on(
    Converter.EVENT_CREATE_SIGNATURE,
    (context: Context, signature: SignatureReflection) => {
      const declaration = signature.parent
      if (signature.comment || !declaration.comment) {
        return
      }

      const valueDeclaration =
        context.getSymbolFromReflection(declaration)?.valueDeclaration
      if (!valueDeclaration || !ts.isVariableDeclaration(valueDeclaration)) {
        return
      }

      signature.comment = declaration.comment.clone()
      signature.comment.removeModifier("@function")
    }
  )

  if (isPatched) {
    return
  }
  isPatched = true

  const originalGetComment = Context.prototype.getComment
  Context.prototype.getComment = function (symbol, kind) {
    const comment = originalGetComment.call(this, symbol, kind)
    const modifier = getImpliedModifier(this, symbol, kind)
    if (!modifier || comment?.hasModifier(modifier)) {
      return comment
    }

    const impliedComment = comment?.clone() ?? new Comment()
    impliedComment.modifierTags.add(modifier)
    return impliedComment
  }
}

function getImpliedModifier(
  context: Context,
  symbol: ts.Symbol,
  kind: ReflectionKind
): `@${string}` | undefined {
  const declaration = symbol.getDeclarations()?.[0]
  if (!declaration) {
    return
  }

  if (kind === ReflectionKind.Namespace) {
    return ts.isNamespaceExport(declaration) ? "@primaryExport" : undefined
  }

  if (kind !== ReflectionKind.Variable) {
    return
  }

  const type = context.checker.getTypeOfSymbolAtLocation(symbol, declaration)
  return type.getCallSignatures().length &&
    !type.getConstructSignatures().length
    ? "@function"
    : undefined
}
