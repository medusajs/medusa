import {
  BeforeCreate,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
} from "@mikro-orm/core"
import { generateEntityId } from "../../common"

@Entity({ abstract: true })
export class BaseEntity {
  [OptionalProps]?: BaseEntity["id"] | BaseEntity["__prefix_id__"]

  private __prefix_id__?: string

  constructor({ prefix_id }: { prefix_id?: string } = {}) {
    this.__prefix_id__ = prefix_id
  }

  @PrimaryKey({ columnType: "text" })
  id!: string

  @OnInit()
  @BeforeCreate()
  onInitOrBeforeCreate_() {
    this.id ??= this.generateEntityId(this.__prefix_id__)
  }

  private generateEntityId(prefixId?: string): string {
    if (prefixId) {
      return generateEntityId(undefined, prefixId)
    }

    let ensuredPrefixId = Object.getPrototypeOf(this).constructor.name as string

    /*
     * Split the class name (camel case) into words and exclude model and entity from the words
     */
    const words = ensuredPrefixId
      .split(/(?=[A-Z])/)
      .filter((word) => !["entity", "model"].includes(word.toLowerCase()))
    const wordsLength = words.length

    /*
     * if the class name (camel case) contains one word, the prefix id is the first three letters of the word
     * if the class name (camel case) contains two words, the prefix id is the first two letters of the first word plus the first letter of the second one
     * if the class name (camel case) contains more than two words, the prefix id is the first letter of each word
     */
    if (wordsLength === 1) {
      ensuredPrefixId = words[0].substring(0, 3)
    } else if (wordsLength === 2) {
      ensuredPrefixId = words
        .map((word, index) => {
          return word.substring(0, 2 - index)
        })
        .join("")
    } else {
      ensuredPrefixId = words
        .map((word) => {
          return word[0]
        })
        .join("")
    }

    this.__prefix_id__ = ensuredPrefixId.toLowerCase()
    return generateEntityId(undefined, this.__prefix_id__)
  }
}
