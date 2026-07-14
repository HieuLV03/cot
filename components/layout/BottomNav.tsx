"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Users,
  PlusCircle,
  User,
} from "lucide-react";

import { useCameraStore } from "@/store/camera.store";

export default function BottomNav() {

  const pathname = usePathname();

  const openCamera = useCameraStore(
    state => state.openCamera
  );

  function navClass(active: boolean) {

    return `
      flex
      h-full
      flex-1
      flex-col
      items-center
      justify-center
      gap-1
      transition-all
      duration-200
      ${
        active
          ? "text-black"
          : "text-neutral-400 hover:text-black"
      }
    `;

  }

  function iconClass(active: boolean) {

    return `
      rounded-xl
      p-2
      transition-all
      duration-200
      ${
        active
          ? "bg-neutral-100 scale-110"
          : ""
      }
    `;

  }

  return (

    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        bg-white/95
        backdrop-blur
      "
    >

      <div
        className="
          mx-auto
          flex
          h-16
          max-w-md
        "
      >

        <Link
          href="/feed"
          className={navClass(pathname === "/feed")}
        >

          <div
            className={iconClass(pathname === "/feed")}
          >
            <House size={24} />
          </div>

          <span className="text-[11px]">
            Trang chủ
          </span>

        </Link>



        <Link
          href="/friends"
          className={navClass(pathname === "/friends")}
        >

          <div
            className={iconClass(pathname === "/friends")}
          >
            <Users size={24} />
          </div>

          <span className="text-[11px]">
            Bạn bè
          </span>

        </Link>



        <div
          className="
            flex
            flex-1
            items-center
            justify-center
          "
        >

          <button
            onClick={openCamera}
            className="
              -mt-8
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-black
              text-white
              shadow-xl
              transition
              hover:scale-105
              active:scale-95
            "
          >

            <PlusCircle size={30} />

          </button>

        </div>



        <Link
          href="/profile"
          className={navClass(pathname === "/profile")}
        >

          <div
            className={iconClass(pathname === "/profile")}
          >
            <User size={24} />
          </div>

          <span className="text-[11px]">
            Cá nhân
          </span>

        </Link>

      </div>

    </nav>

  );

}