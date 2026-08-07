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
    <div className="fixed right-4 top-4 z-50 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg">
      {message}
    </div>
  );
}
