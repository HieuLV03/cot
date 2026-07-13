import { create } from "zustand";

export type FacingMode =
  | "user"
  | "environment";

type CameraStore = {

  isOpen: boolean;

  facingMode: FacingMode;

  image: string | null;

  file: File | null;

  isPreview: boolean;

  openCamera: () => void;

  closeCamera: () => void;

  switchCamera: () => void;

  setImage: (
    image: string,
    file: File
  ) => void;

  clearImage: () => void;

};

export const useCameraStore =
create<CameraStore>((set) => ({

  isOpen: false,

  facingMode: "environment",

  image: null,

  file: null,

  isPreview: false,

  openCamera: () =>

    set({

      isOpen: true,

    }),

  closeCamera: () =>

    set((state) => {

      if (state.image) {

        URL.revokeObjectURL(
          state.image
        );

      }

      return {

        isOpen: false,

        facingMode: "environment",

        image: null,

        file: null,

        isPreview: false,

      };

    }),

  switchCamera: () =>

    set((state) => ({

      facingMode:

        state.facingMode ===
        "environment"

          ? "user"

          : "environment",

    })),

  setImage: (

    image,

    file

  ) =>

    set((state) => {

      if (state.image) {

        URL.revokeObjectURL(
          state.image
        );

      }

      return {

        image,

        file,

        isPreview: true,

      };

    }),

  clearImage: () =>

    set((state) => {

      if (state.image) {

        URL.revokeObjectURL(
          state.image
        );

      }

      return {

        image: null,

        file: null,

        isPreview: false,

      };

    }),

}));