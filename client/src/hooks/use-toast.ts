import * as React from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction = 
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'DISMISS_TOAST'; toastId: string };

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts] };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) };
    default:
      return state;
  }
}

let count = 0;
function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export function useToast() {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const toast = React.useCallback(({ title, description, variant }: Omit<Toast, 'id'>) => {
    const id = generateId();
    dispatch({ type: 'ADD_TOAST', toast: { id, title, description, variant } });
    const timeout = setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST', toastId: id });
      toastTimeouts.delete(id);
    }, 5000);
    toastTimeouts.set(id, timeout);
    return id;
  }, []);

  const dismiss = React.useCallback((toastId: string) => {
    const timeout = toastTimeouts.get(toastId);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.delete(toastId);
    }
    dispatch({ type: 'DISMISS_TOAST', toastId });
  }, []);

  return { toasts: state.toasts, toast, dismiss };
}
