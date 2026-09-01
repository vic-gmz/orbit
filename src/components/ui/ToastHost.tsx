import { useEffect, useState } from "react";
import { subscribeToToast } from "../../lib/toast";

export default function ToastHost() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const unsubscribe = subscribeToToast((msg) => {
      setMessage(msg);
      timers.push(setTimeout(() => setMessage(null), 4000));
    });
    return () => {
      unsubscribe();
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-50 flex max-w-[calc(100%-2rem)] items-center gap-2.5 rounded-2xl border border-sand bg-paper px-4 py-3 text-sm text-ink shadow-lift md:bottom-6 md:right-6 md:max-w-sm"
      role="status"
      style={{ animation: "toast-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both" }}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-sun to-coral"
        aria-hidden="true"
      />
      <span className="min-w-0">{message}</span>
    </div>
  );
}
