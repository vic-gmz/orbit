type ToastListener = (message: string) => void;

const listeners = new Set<ToastListener>();

export function toast(message: string) {
  listeners.forEach((l) => l(message));
}

export function subscribeToToast(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
