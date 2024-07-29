import { existsSync, readFileSync } from "fs"
import path from "path"
import {
  Application,
  Comment,
  Context,
  Converter,
  DeclarationReflection,
  ReferenceType,
} from "typedoc"
import { getDmlProperties, isDmlEntity } from "utils"
import { DmlFile } from "types"

const FILE_NAME_REGEX = /packages\/modules\/(?<module>[a-z-]+)/

export function load(app: Application) {
  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    getDescriptionsFromJson,
    2
  )
}

function getDescriptionsFromJson(
  context: Context,
  reflection: DeclarationReflection
) {
  if (!isDmlEntity(reflection)) {
    return
  }

  const dmlPropertyReflections = getDmlProperties(
    reflection.type as ReferenceType
  )

  if (!dmlPropertyReflections) {
    return
  }

  const fileName = context.project
    .getSymbolFromReflection(reflection)
    ?.valueDeclaration?.parent.getSourceFile().fileName

  if (!fileName) {
    return
  }

  const moduleName = FILE_NAME_REGEX.exec(fileName)

  if (!moduleName?.groups?.module) {
    return
  }

  const jsonFilePath = path.resolve(
    __dirname,
    path.join(
      "..",
      "..",
      "..",
      "generated",
      "dml-output",
      `${moduleName.groups.module}.json`
    )
  )

  if (!existsSync(jsonFilePath)) {
    return
  }

  const jsonFileContent = JSON.parse(
    readFileSync(jsonFilePath, "utf-8")
  ) as DmlFile

  if (!jsonFileContent[reflection.name]) {
    return
  }

  Object.entries(jsonFileContent[reflection.name].properties).forEach(
    ([propertyName, description]) => {
      const propertyReflection = dmlPropertyReflections.find(
        (propertyRef) => propertyRef.name === propertyName
      )

      if (!propertyReflection) {
        return
      }

      const comment = propertyReflection.comment || new Comment()

      const isExpandable = description.includes("@expandable")

      comment.summary.push({
        kind: "text",
        text: description.replace("@expandable", "").trim(),
      })

      if (isExpandable) {
        comment.modifierTags.add("@expandable")
      }

      propertyReflection.comment = comment
    }
  )
}
