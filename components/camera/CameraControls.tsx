"use client";

import { RefObject } from "react";

import {
  Camera,
  Image,
  Repeat2,
  X,
} from "lucide-react";

import { capturePhoto } from "./CameraCapture";

import { useCameraStore } from "@/store/camera.store";

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

export default function CameraControls({
  videoRef,
}: Props) {

  const facingMode = useCameraStore(
    state => state.facingMode
  );

  const switchCamera = useCameraStore(
    state => state.switchCamera
  );

  const closeCamera = useCameraStore(
    state => state.closeCamera
  );

  const setImage = useCameraStore(
    state => state.setImage
  );

  async function handleCapture() {

    if (!videoRef.current) {
      alert("Camera chưa sẵn sàng");
      return;
    }

    try {

      const result = await capturePhoto({

        video: videoRef.current,

        facingMode,

      });

      setImage(
        result.preview,
        result.file
      );

    } catch (error) {

      console.error(error);

      alert("Không thể chụp ảnh");

    }

  }

  function pickImage() {

    const input =
      document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.onchange = () => {

      const file =
        input.files?.[0];

      if (!file) return;

      const preview =
        URL.createObjectURL(file);

      setImage(
        preview,
        file
      );

    };

    input.click();

  }

  return (

    <>

      {/* Đổi camera */}

      <button
        onClick={switchCamera}
        className="
          absolute
          left-5
          top-5
          rounded-full
          bg-black/40
          p-3
        "
      >

        <Repeat2
          size={24}
          color="white"
        />

      </button>


      {/* Đóng */}

      <button
        onClick={closeCamera}
        className="
          absolute
          right-5
          top-5
          rounded-full
          bg-black/40
          p-3
        "
      >

        <X
          size={24}
          color="white"
        />

      </button>


      {/* Bottom */}

      <div
        className="
          absolute
          bottom-10
          left-0
          flex
          w-full
          items-center
          justify-center
          gap-14
        "
      >

        {/* Chọn ảnh */}

        <button
          onClick={pickImage}
        >

          <Image
            size={30}
            color="white"
          />

        </button>


        {/* Chụp */}

        <button
          onClick={handleCapture}
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border-[5px]
            border-white
            bg-white/10
            active:scale-95
            transition
          "
        >

          <Camera
            size={34}
            color="white"
          />

        </button>

      </div>

    </>

  );

}