import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import ToastHost from "../ui/ToastHost";

export default function Layout() {
  return (
    <div className="flex min-h-svh">
      <div className="dawn-bg" aria-hidden="true" />
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <main className="min-w-0 flex-1 pb-20 md:pb-0">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
          <Outlet />
        </div>
      </main>
      <MobileNav />
      <ToastHost />
    </div>
  );
}
