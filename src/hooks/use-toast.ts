import * as React from "react"
import { toast as sonnerToast } from "sonner"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  duration?: number
  dismissible?: boolean
  className?: string
  open?: boolean
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Action =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: ToasterToast["id"]
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
const sonnerToastIds = new Map<string, string | number>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        const sonnerId = sonnerToastIds.get(toastId)
        if (sonnerId) {
          sonnerToast.dismiss(sonnerId)
          sonnerToastIds.delete(toastId)
        }
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          const sonnerId = sonnerToastIds.get(toast.id)
          if (sonnerId) {
            sonnerToast.dismiss(sonnerId)
            sonnerToastIds.delete(toast.id)
          }
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // Dismiss all sonner toasts
        sonnerToastIds.forEach((sonnerId) => {
          sonnerToast.dismiss(sonnerId)
        })
        sonnerToastIds.clear()
        return {
          ...state,
          toasts: [],
        }
      }
      
      const sonnerId = sonnerToastIds.get(action.toastId)
      if (sonnerId) {
        sonnerToast.dismiss(sonnerId)
        sonnerToastIds.delete(action.toastId)
      }
      
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ variant = "default", duration, ...props }: Toast) {
  const id = genId()

  const update = (updatedProps: Partial<ToasterToast>) => {
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...updatedProps, id },
    })
    
    // Update the sonner toast as well
    const sonnerId = sonnerToastIds.get(id)
    if (sonnerId && updatedProps.title) {
      // Sonner doesn't have direct update, so we dismiss and recreate
      sonnerToast.dismiss(sonnerId)
      const newSonnerId = createSonnerToast({ ...props, ...updatedProps }, variant, duration)
      sonnerToastIds.set(id, newSonnerId)
    }
  }
  
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Create sonner toast
  const sonnerId = createSonnerToast(props, variant, duration)
  sonnerToastIds.set(id, sonnerId)

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      variant,
      duration,
      open: true,
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function createSonnerToast(
  props: Omit<Toast, "variant" | "duration">, 
  variant: ToasterToast["variant"] = "default",
  duration?: number
) {
  const options = {
    duration: duration || TOAST_REMOVE_DELAY,
    action: props.action,
    className: props.className,
    dismissible: props.dismissible !== false,
  }

  switch (variant) {
    case "destructive":
      return sonnerToast.error(props.title || props.description, {
        description: props.title ? props.description : undefined,
        ...options,
      })
    case "success":
      return sonnerToast.success(props.title || props.description, {
        description: props.title ? props.description : undefined,
        ...options,
      })
    case "warning":
      return sonnerToast.warning(props.title || props.description, {
        description: props.title ? props.description : undefined,
        ...options,
      })
    case "info":
      return sonnerToast.info(props.title || props.description, {
        description: props.title ? props.description : undefined,
        ...options,
      })
    default:
      return sonnerToast(props.title || props.description, {
        description: props.title ? props.description : undefined,
        ...options,
      })
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }