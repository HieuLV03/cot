"use client";

import { useCameraStore } from "@/store/camera.store";

export default function CameraPreview() {

  const image = useCameraStore(
    state => state.image
  );

  const clearImage = useCameraStore(
    state => state.clearImage
  );

  if (!image) return null;

  return (

    <div
      className="
        absolute
        inset-0
        z-50
        bg-black
      "
    >

      <img
        src={image}
        alt="Preview"
        className="
          h-full
          w-full
          object-cover
        "
      />

      <div
        className="
          absolute
          bottom-10
          left-0
          flex
          w-full
          justify-center
          gap-5
          px-6
        "
      >

        <button
          onClick={clearImage}
          className="
            flex-1
            rounded-xl
            bg-white
            py-4
            font-semibold
          "
        >

          Chụp lại

        </button>


        <button
          onClick={() => {

            console.log(
              "Upload Supabase..."
            );

          }}
          className="
            flex-1
            rounded-xl
            bg-blue-500
            py-4
            font-semibold
            text-white
          "
        >

          Đăng

        </button>

      </div>

    </div>

  );

}