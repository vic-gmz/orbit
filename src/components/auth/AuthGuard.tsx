import { useConvexAuth } from "convex/react";
import { Outlet } from "react-router-dom";
import AuthForm from "../AuthForm";

export default function AuthGuard() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="relative flex min-h-svh items-center justify-center">
        <div className="dawn-bg" aria-hidden="true" />
        <p className="text-sm text-muted">Preparing the morning light…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10">
        <div className="dawn-bg" aria-hidden="true" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="sun-disc absolute -top-44 right-[-11rem] h-[36rem] w-[36rem] opacity-90" />
          <div className="sun-disc absolute bottom-[-18rem] left-[-8rem] h-[30rem] w-[30rem] opacity-50" />
          <div className="orbit-ring spin absolute -top-20 right-[-7rem] h-[26rem] w-[26rem] opacity-80" />
          <div className="orbit-ring spin-rev absolute bottom-[-12rem] left-[-5rem] h-[30rem] w-[30rem] opacity-70" />
          <div className="orbit-ring spin absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-50" />
        </div>
        <div className="relative z-10 w-full max-w-sm">
          <AuthForm />
        </div>
      </div>
    );
  }

  return <Outlet />;
}
