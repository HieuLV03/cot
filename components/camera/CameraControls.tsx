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

    if (!videoRef.current) return;

    try {

      const result =
        await capturePhoto(
          videoRef.current
        );

      setImage(
        result.preview,
        result.file
      );

    } catch (error) {

      console.log(error);

      alert("Không thể chụp ảnh");

    }

  }


  function pickImage() {

    const input =
      document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.onchange = async () => {

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
          gap-12
        "
      >

        {/* Album */}

        <button
          onClick={pickImage}
        >

          <Image
            color="white"
            size={30}
          />

        </button>


        {/* Capture */}

        <button
          onClick={handleCapture}
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border-4
            border-white
          "
        >

          <Camera
            color="white"
            size={34}
          />

        </button>

      </div>

    </>

  );

}