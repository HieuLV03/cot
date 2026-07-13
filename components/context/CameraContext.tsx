"use client";

import { createContext, useContext, useState } from "react";

type CameraContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const CameraContext = createContext<CameraContextType | null>(null);

export function CameraProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <CameraContext.Provider value={{ open, setOpen }}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);

  if (!context) {
    throw new Error("useCamera must be used inside CameraProvider");
  }

  return context;
}