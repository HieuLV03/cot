import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
      <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">

        <div className="w-8" />

        <h1 className="text-xl font-bold tracking-tight">
          Chí Cốt
        </h1>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-neutral-100"
        >
          <Bell size={22} />
        </button>

      </div>
    </header>
  );
}