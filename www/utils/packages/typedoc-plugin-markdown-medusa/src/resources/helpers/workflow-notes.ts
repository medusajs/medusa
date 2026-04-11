import Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "workflowNotes",
    function (this: SignatureReflection): string {
      const notes: string[] = []
      const hasLocking = this.parent.comment?.blockTags.some(
        (tag) => tag.tag === "@workflowLock"
      )

      if (hasLocking) {
        notes.push(
          `:::note

If you use this workflow in another, you must acquire a lock before running it and release the lock after. Learn more in the [Locking Operations in Workflows](https://docs.medusajs.com/learn/fundamentals/workflows/locks#locks-in-nested-workflows) guide.

:::`
        )
      }

      return notes.join("\n\n")
    }
  )
}
