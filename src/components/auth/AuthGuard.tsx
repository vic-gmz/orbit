import { useConvexAuth } from "convex/react";
import { Outlet } from "react-router-dom";
import AuthForm from "../AuthForm";

export default function AuthGuard() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <AuthForm />
      </div>
    );
  }

  return <Outlet />;
}
