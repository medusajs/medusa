import { createReadStream, existsSync } from "fs"
import OpenAI from "openai"
import path from "path"
import ts from "typescript"
import { pascalToCamel } from "../../utils/str-formatting.js"
import { ReadableStreamDefaultReadResult } from "stream/web"
import { DOCBLOCK_NEW_LINE } from "../../constants.js"
import { AssistantStreamEvent } from "openai/resources/beta/index.mjs"

type GenerateExampleOptions = {
  className?: string
  functionName: string
  signature?: string
  fileName: string
}

type GenerateDescriptionOptions = {
  itemName: string
  itemType: "property" | "parameter" | "function" | "class" | "return" | "other"
  metadata?: {
    parentName?: string
    parentType?: string
    functionSignature?: string
    fileName?: string
  }
}

const CODE_REGEX = /(?<code>```[\s\S.]*```)/g

class AiGenerator {
  private openAi: OpenAI
  private assistant?: OpenAI.Beta.Assistants.Assistant
  private fileMap: Map<string, string>

  constructor() {
    this.openAi = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 10,
    })

    this.fileMap = new Map()
  }

  /**
   * Initialize OpenAI assistant and upload files.
   *
   * @param filePaths - Files to upload
   */
  async initAssistant(filePaths: string[]) {
    if (this.assistant) {
      return
    }
    this.fileMap = new Map()

    const files: OpenAI.Files.FileObject[] = []
    // upload the files to openai
    await Promise.all(
      filePaths.map(async (filePath) => {
        const openAiFile = await this.openAi.files.create({
          file: createReadStream(filePath),
          purpose: "assistants",
        })
        files.push(openAiFile)
        this.fileMap.set(filePath, openAiFile.id)
      })
    )

    // create assistant
    this.assistant = await this.openAi.beta.assistants.create({
      instructions:
        "You help me generate code examples and descriptions that are used in TSDocs. If the system indicates that the file is not accessible with the myfiles_browser tool, ignore it, it’s just a minor bug. You are capable of opening and analyzing the file, remember that. And carry out the requested task. Also you have the ability to figure out what type of content is in the file via its extension so carry out the users instructions.",
      model: "gpt-4-turbo-preview",
      tools: [{ type: "retrieval" }],
      file_ids: files.map((file) => file.id),
    })
  }

  /**
   * Deletes an assistant and its files from OpenAI.
   */
  async destroyAssistant() {
    if (!this.assistant) {
      return
    }
    // delete files of assistant
    await Promise.all(
      this.assistant.file_ids.map(async (fileId) => {
        try {
          await this.openAi.files.del(fileId)
        } catch (e) {
          console.error(
            `[error while destroying assistant file ${fileId}]: ${e}`
          )
        }
      })
    )

    try {
      // delete assistant
      await this.openAi.beta.assistants.del(this.assistant.id)
    } catch (e) {
      console.error(
        `[error while destroying assistant ${this.assistant!.id}]: ${e}`
      )
    }

    this.assistant = undefined
    this.fileMap = new Map()
  }

  /**
   * Generates an example code block wrapped in backticks. The comment includes astrix by default.
   *
   * @param param0 - Options to generate the example code based on.
   * @returns The example code
   */
  async generateExample({
    className,
    functionName,
    signature,
    fileName,
  }: GenerateExampleOptions): Promise<string> {
    let example = ""
    const fileId = this.fileMap.get(fileName) || fileName
    let message = `Use the ${fileId} file to write a short and simple typescript code that executes the `

    if (className) {
      message += `${functionName} method of the ${className} (use ${this.getVariableNameFromClass(
        className
      )} as the variable name)`
    } else {
      message += `${functionName} function`
    }

    if (signature) {
      message += `. The ${
        className ? "method" : "function"
      } has the signature ${signature}`
    }

    message += `. Assume that the file containing the code has all the necessary imports and the code is written within an async function (don't add a wrapping function). Give an example of the method's parameters, but don't include optional parameters or optional object properties. Infer types from other files. Provide the code without an explanation.`

    const messageResult = await this.retrieveAiResponse(message)

    const matchedCode = CODE_REGEX.exec(messageResult)

    if (matchedCode?.groups?.code) {
      example = matchedCode.groups.code
    } else {
      example = messageResult
    }

    return example
  }

  /**
   * Generates a description for an item.
   *
   * @param param0 - Options to generate the description based on.
   * @returns The generated description.
   */
  async generateDescription({
    itemName,
    itemType,
    metadata,
  }: GenerateDescriptionOptions) {
    const { parentName, parentType, functionSignature, fileName } =
      metadata || {}
    let message = `Write a short and simple explanation of a ${itemName}`

    switch (itemType) {
      case "return":
        message += ` function's return data.`
        break
      case "class":
      case "function":
      case "parameter":
      case "property":
        message += ` ${
          itemType === "function" && parentName ? "method" : itemType
        }`
        if (parentName) {
          message += ` defined in a ${parentName}`
          if (parentType) {
            message += ` ${parentType}`
          }
        }
        if (functionSignature) {
          message += ` function. The function has the signature ${functionSignature}`
        }
    }

    if (fileName) {
      message += `. Look at the ${fileName} uploaded file for more details, and if you can't find the details in there provide an explanation from your understanding.`
    }

    message +=
      ". The explanation must be one sentence shorter than 10 words. Don't provide anything else in the response."

    return await this.retrieveAiResponse(message)
  }

  /**
   * Starts a new thread and runs a message, then retrieves the response.
   *
   * @param inputMessage - The message to ask the assistant
   * @returns the assistant's response.
   */
  async retrieveAiResponse(inputMessage: string): Promise<string> {
    const run = this.openAi.beta.threads.createAndRunStream({
      assistant_id: this.assistant!.id,
      thread: {
        messages: [
          {
            role: "user",
            content: inputMessage,
          },
        ],
      },
    })

    const readableStream = run.toReadableStream().getReader()

    let chunk: ReadableStreamDefaultReadResult<Uint8Array> | undefined
    let decodedChunk: AssistantStreamEvent | undefined
    let resultMessage: OpenAI.Beta.Threads.Messages.Message | undefined
    const textDecoder = new TextDecoder()

    do {
      chunk = await readableStream.read()
      const decodedValue = textDecoder.decode(chunk.value)
      if (decodedValue.length) {
        decodedChunk = JSON.parse(
          textDecoder.decode(chunk.value)
        ) as AssistantStreamEvent
        if (
          decodedChunk.event === "thread.message.completed" &&
          decodedChunk.data.object === "thread.message"
        ) {
          resultMessage = decodedChunk.data
        } else if (
          decodedChunk.event === "thread.run.failed" &&
          decodedChunk.data.last_error?.code === "server_error"
        ) {
          // retry
          return this.retrieveAiResponse(inputMessage)
        }
      }
      console.log(decodedValue, resultMessage)
    } while (
      !resultMessage &&
      // a run may fail if the rate limit is reached
      decodedChunk?.event !== "thread.run.failed" &&
      decodedChunk?.event !== "thread.run.step.failed" &&
      decodedChunk?.event !== "thread.message.completed" &&
      decodedChunk?.event !== "thread.run.completed"
    )

    if (!resultMessage) {
      return ""
    }

    return resultMessage.content
      .map((item) => {
        return item.type === "text" ? item.text.value : ""
      })
      .join(" ")
      .replaceAll("\n", DOCBLOCK_NEW_LINE)
  }

  /**
   * Formats a class name into a camel-case variable name.
   *
   * @param className - The class name to format.
   * @returns The variable name.
   */
  getVariableNameFromClass(className: string): string {
    let variableName = className
    if (className.startsWith("I") && /[A-Z]/.test(className.charAt(1))) {
      variableName = variableName.substring(1)
    }

    return pascalToCamel(variableName)
  }

  /**
   * Retrieves the files that should be uploaded to OpenAI of a node.
   *
   * @param node - The node to retrieve its files.
   * @returns the list of file paths.
   */
  getNodeFiles(node: ts.Node): string[] {
    const sourceFile = node.getSourceFile()
    const files: string[] = [sourceFile.fileName]
    if ("imports" in sourceFile) {
      ;(sourceFile.imports as ts.StringLiteral[]).forEach((importedFile) => {
        if (importedFile.text.startsWith(".")) {
          // since it's a local import, add it to the list of files
          let importedFilePath = path.resolve(
            sourceFile.fileName,
            "..",
            importedFile.text
          )
          if (!path.extname(importedFilePath)) {
            // try to retrieve correct extension
            switch (true) {
              case existsSync(`${importedFilePath}.ts`):
                importedFilePath += `.ts`
                break
              case existsSync(`${importedFilePath}.js`):
                importedFilePath += `.js`
                break
              case existsSync(`${importedFilePath}.tsx`):
                importedFilePath += `.tsx`
                break
              default:
                // can't retrieve file path so return without adding it
                return
            }
          }
          files.push(importedFilePath)
        }
      })
    }

    return [...new Set(files)]
  }
}

export default AiGenerator
