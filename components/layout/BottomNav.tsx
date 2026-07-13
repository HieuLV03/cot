"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Users, PlusCircle, User } from "lucide-react";

import { useCameraStore } from "@/store/camera.store";
export default function BottomNav() {
  const pathname = usePathname();
const openCamera = useCameraStore(
  (state) => state.openCamera
);
  const itemClass = (active: boolean) =>
    `flex flex-col items-center gap-1 transition ${
      active ? "text-black" : "text-neutral-400"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">

        <Link
          href="/feed"
          className={itemClass(pathname === "/feed")}
        >
          <House size={22} />
        </Link>

        <Link
          href="/friends"
          className={itemClass(pathname === "/friends")}
        >
          <Users size={22} />
        </Link>

        <button
          type="button"
          onClick={openCamera}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <PlusCircle size={28} />
        </button>

        <Link
          href="/profile"
          className={itemClass(pathname === "/profile")}
        >
          <User size={22} />
        </Link>

      </div>
    </nav>
  );
}