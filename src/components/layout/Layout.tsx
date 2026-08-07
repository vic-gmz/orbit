import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ToastHost from "../ui/ToastHost";

export default function Layout() {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <ToastHost />
    </div>
  );
}
