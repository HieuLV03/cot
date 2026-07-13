import { create } from "zustand";

type CameraStore = {
  isOpen: boolean;
  facingMode: "user" | "environment";

  openCamera: () => void;
  closeCamera: () => void;
  switchCamera: () => void;
};

export const useCameraStore = create<CameraStore>((set) => ({
  isOpen: false,
  facingMode: "environment",

  openCamera: () =>
    set({
      isOpen: true,
    }),

  closeCamera: () =>
    set({
      isOpen: false,
    }),

  switchCamera: () =>
    set((state) => ({
      facingMode:
        state.facingMode === "environment"
          ? "user"
          : "environment",
    })),
}));