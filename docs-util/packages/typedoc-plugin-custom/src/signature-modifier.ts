import {
  Application,
  Context,
  Converter,
  ProjectReflection,
  SignatureReflection,
} from "typedoc"

export function load(app: Application) {
  app.converter.on(
    Converter.EVENT_CREATE_SIGNATURE,
    (
      context: Context,
      signature: SignatureReflection | ProjectReflection | undefined
    ) => {
      if (signature?.comment?.hasModifier("@hideSignature")) {
        context.project.removeReflection(signature)
      }
    }
  )
}
