import { Toast } from "@/components/toast"
import { ToastAction, ToastVariant, ToasterPosition } from "@/types"
import * as React from "react"
import { toast as toastFn } from "sonner"

interface BaseToastProps {
  id?: string | number
  position?: ToasterPosition
  dismissable?: boolean
  dismissLabel?: string
  duration?: number
}

interface ToastProps extends BaseToastProps {
  description?: string
  action?: ToastAction
}

function create(variant: ToastVariant, title: string, props: ToastProps = {}) {
  return toastFn.custom(
    (t) => {
      return (
        <Toast
          id={props.id || t}
          title={title}
          description={props.description}
          onDismiss={
            props.dismissable ? () => toastFn.dismiss(props.id || t) : undefined
          }
          dismissLabel={props.dismissLabel}
          variant={variant}
          action={props.action}
        />
      )
    },
    {
      id: props.id,
      position: props.position,
      dismissible: props.dismissable,
    }
  )
}

function message(title: string, props: ToastProps = {}) {
  return create("message", title, props)
}

function info(title: string, props: ToastProps = {}) {
  return create("info", title, props)
}

function error(title: string, props: ToastProps = {}) {
  return create("error", title, props)
}

function success(title: string, props: ToastProps = {}) {
  return create("success", title, props)
}

function warning(title: string, props: ToastProps = {}) {
  return create("warning", title, props)
}

type LoadingToastProps = Omit<ToastProps, "dismissable" | "dismissLabel">

function loading(title: string, props: LoadingToastProps = {}) {
  return create("loading", title, { ...props, dismissable: false })
}

type PromiseStateProps =
  | string
  | {
      title: string
      description?: string
    }

interface PromiseToastProps extends BaseToastProps {
  loading: PromiseStateProps
  success: PromiseStateProps
  error: PromiseStateProps
}

function createUniqueID() {
  return Math.random().toString(36).slice(2, 8)
}

async function promise<TData>(
  promise: Promise<TData> | (() => Promise<TData>),
  props: PromiseToastProps
) {
  let id: string | number | undefined = props.id || createUniqueID()
  let shouldDismiss = id !== undefined

  id = create(
    "loading",
    typeof props.loading === "string" ? props.loading : props.loading.title,
    {
      id: id,
      position: props.position,
      description:
        typeof props.loading === "string"
          ? undefined
          : props.loading.description,
      duration: Infinity,
    }
  )

  const p = promise instanceof Promise ? promise : promise()

  p.then(() => {
    shouldDismiss = false
    create(
      "success",
      typeof props.success === "string" ? props.success : props.success.title,
      {
        id: id,
        position: props.position,
        description:
          typeof props.success === "string"
            ? undefined
            : props.success.description,
      }
    )
  })
    .catch(() => {
      shouldDismiss = false
      create(
        "error",
        typeof props.error === "string" ? props.error : props.error.title,
        {
          id: id,
          position: props.position,
          description:
            typeof props.error === "string"
              ? undefined
              : props.error.description,
        }
      )
    })
    .finally(() => {
      if (shouldDismiss) {
        toastFn.dismiss(id)
        id = undefined
      }
    })

  return id
}

export const toast = Object.assign(message, {
  info,
  error,
  warning,
  success,
  promise,
  loading,
  dismiss: toastFn.dismiss,
})
