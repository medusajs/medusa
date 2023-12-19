import {
  Application,
  Context,
  Converter,
  // DeclarationReflection,
  ParameterType,
  SignatureReflection,
} from "typedoc"

export function load(app: Application) {
  app.options.addDeclaration({
    name: "enableReactQueryManipulator",
    type: ParameterType.Boolean,
    help: "Whether to enable the React Query manipulator.",
    defaultValue: false,
  })
  app.converter.on(
    Converter.EVENT_CREATE_SIGNATURE,
    (context: Context, reflection: SignatureReflection) => {
      if (!app.options.getValue("enableReactQueryManipulator")) {
        return
      }
      if (reflection.name === "useAdminLogin") {
        console.log(reflection)
      }
      // TODO add check for queries
      const isReactQueryMutation =
        reflection.type?.type === "reference" &&
        reflection.type.name === "UseMutationResult"
      if (isReactQueryMutation) {
        // get parameters
      }
    }
  )
}
