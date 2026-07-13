import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import CameraModal from "@/components/camera/CameraModal";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />

      <main className="mx-auto max-w-md pb-24 pt-16">
        {children}
      </main>

      <BottomNav />

      <CameraModal />
    </div>
  );
}