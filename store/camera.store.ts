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
    set({

      isOpen: false,

      image: null,

      file: null,

      isPreview: false,

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

    set({

      image,

      file,

      isPreview: true,

    }),



  clearImage: () =>

    set({

      image: null,

      file: null,

      isPreview: false,

    }),

}));