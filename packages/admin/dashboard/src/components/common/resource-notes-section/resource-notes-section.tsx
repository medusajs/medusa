import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpCircleSolid, XMarkMini } from "@medusajs/icons"
import { NoteDTO, NoteResourceType } from "@medusajs/types"
import {
  Container,
  Heading,
  IconButton,
  Text,
  Tooltip,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import {
  useCreateNote,
  useDeleteNote,
  useNotes,
} from "../../../hooks/api/notes"
import { useDate } from "../../../hooks/use-date"
import { KeyboundForm } from "../../utilities/keybound-form"
import { Form } from "../form"
import { By } from "../user-link"

type ResourceNotesSectionProps = {
  resourceType: NoteResourceType
  resourceId: string
}

/**
 * Arbitrary high limit to ensure all notes for the resource are fetched.
 */
const NOTE_LIMIT = 9999

export const ResourceNotesSection = ({
  resourceType,
  resourceId,
}: ResourceNotesSectionProps) => {
  const { t } = useTranslation()

  const {
    notes = [],
    isError,
  } = useNotes({
    resource_type: resourceType,
    resource_id: resourceId,
    limit: NOTE_LIMIT,
    offset: 0,
  })

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [notes])

  if (isError) {
    return (
      <Container className="flex flex-col gap-y-4 px-6 py-4">
        <Heading level="h2">{t("notes.header")}</Heading>
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {t("notes.loadError")}
        </Text>
      </Container>
    )
  }

  return (
    <Container className="flex flex-col gap-y-4 px-6 py-4">
      <Heading level="h2">{t("notes.header")}</Heading>
      <ResourceNoteForm resourceType={resourceType} resourceId={resourceId} />
      {!!sortedNotes.length && (
        <div className="flex flex-col gap-y-4">
          {sortedNotes.map((note) => (
            <ResourceNoteItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </Container>
  )
}

const NoteSchema = z.object({
  value: z.string().min(1),
})

type ResourceNoteFormProps = {
  resourceType: NoteResourceType
  resourceId: string
}

const ResourceNoteForm = ({
  resourceType,
  resourceId,
}: ResourceNoteFormProps) => {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<z.infer<typeof NoteSchema>>({
    defaultValues: {
      value: "",
    },
    resolver: zodResolver(NoteSchema),
  })

  const { mutateAsync, isPending } = useCreateNote()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        resource_type: resourceType,
        resource_id: resourceId,
        value: values.value,
      },
      {
        onSuccess: () => {
          form.reset()
          handleResetSize()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const handleResize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = textarea.scrollHeight + "px"
    }
  }

  const handleResetSize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
    }
  }

  return (
    <Form {...form}>
      <KeyboundForm onSubmit={handleSubmit}>
        <div className="bg-ui-bg-field shadow-borders-base flex flex-col gap-y-2 rounded-md px-2 py-1.5">
          <Form.Field
            control={form.control}
            name="value"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label hidden>{t("notes.label")}</Form.Label>
                  <Form.Control>
                    <textarea
                      {...field}
                      ref={textareaRef}
                      onInput={handleResize}
                      className="txt-small text-ui-fg-base placeholder:text-ui-fg-muted resize-none overflow-hidden bg-transparent outline-none"
                      placeholder={t("notes.placeholder")}
                      rows={1}
                    />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
          <div className="flex items-center justify-end">
            <IconButton
              type="submit"
              isLoading={isPending}
              variant="transparent"
              size="small"
              className="text-ui-fg-muted hover:text-ui-fg-subtle active:text-ui-fg-subtle"
            >
              <span className="sr-only">{t("notes.addButtonText")}</span>
              <ArrowUpCircleSolid />
            </IconButton>
          </div>
        </div>
      </KeyboundForm>
    </Form>
  )
}

type ResourceNoteItemProps = {
  note: NoteDTO
}

const ResourceNoteItem = ({ note }: ResourceNoteItemProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { getFullDate, getRelativeDate } = useDate()

  const { mutateAsync } = useDeleteNote(note.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("actions.cannotUndo"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="bg-ui-bg-component shadow-borders-base group grid grid-cols-[1fr_20px] items-start gap-x-2 text-pretty rounded-r-2xl rounded-bl-md rounded-tl-xl px-3 py-1.5">
        <div className="flex h-full min-h-7 items-center">
          <Text size="xsmall" className="text-ui-fg-subtle">
            {note.value}
          </Text>
        </div>
        <IconButton
          size="small"
          variant="transparent"
          className="transition-fg invisible opacity-0 group-hover:visible group-hover:opacity-100"
          type="button"
          onClick={handleDelete}
        >
          <span className="sr-only">{t("notes.deleteButtonText")}</span>
          <XMarkMini className="text-ui-fg-muted" />
        </IconButton>
      </div>
      <div className="flex items-center gap-x-2">
        <By id={note.author_id} />
        <Tooltip
          content={getFullDate({ date: note.created_at, includeTime: true })}
        >
          <Text size="small" className="text-ui-fg-subtle">
            {getRelativeDate(note.created_at)}
          </Text>
        </Tooltip>
      </div>
    </div>
  )
}
