import {
  Application,
  Context,
  Converter,
  DeclarationReflection,
  ProjectReflection,
  Reflection,
  SignatureReflection,
  SourceReference,
} from "typedoc"

type MappedReflectionSignature = {
  source: SourceReference
  signatures: SignatureReflection[]
}

type Options = {
  tsconfigPath: string
}

export default class TypedocManager {
  private app: Application | undefined
  private options: Options

  constructor(options: Options) {
    this.options = options
  }

  async setup(filePath: string): Promise<{
    project: ProjectReflection | undefined
    mappedReflectionSignatures: MappedReflectionSignature[]
  }> {
    const mappedReflectionSignatures: MappedReflectionSignature[] = []
    this.app = await Application.bootstrapWithPlugins({
      entryPoints: [filePath],
      tsconfig: this.options.tsconfigPath,
      plugin: ["typedoc-plugin-custom"],
      enableInternalResolve: true,
    })

    // This listener sets the content of mappedReflectionSignatures
    this.app.converter.on(
      Converter.EVENT_RESOLVE,
      (context: Context, reflection: Reflection) => {
        if (reflection instanceof DeclarationReflection) {
          if (reflection.sources?.length && reflection.signatures?.length) {
            mappedReflectionSignatures.push({
              source: reflection.sources[0],
              signatures: reflection.signatures,
            })
          }
        }
      }
    )

    return {
      project: await this.app.convert(),
      mappedReflectionSignatures,
    }
  }
}
