"use client";

import { useState } from "react";
import Image from "next/image";

import { useCameraStore } from "@/store/camera.store";

export default function CameraPreview() {

  const image = useCameraStore(
    state => state.image
  );

  const file = useCameraStore(
    state => state.file
  );

  const isPreview = useCameraStore(
    state => state.isPreview
  );

  const clearImage = useCameraStore(
    state => state.clearImage
  );

  const closeCamera = useCameraStore(
    state => state.closeCamera
  );

  const [loading, setLoading] =
    useState(false);

  if (!isPreview || !image) {
    return null;
  }

  async function handleUpload() {

    if (!file) return;

    try {

      setLoading(true);

      console.log(file);

      // TODO:
      // Upload Supabase

      clearImage();

      closeCamera();

    } catch (error) {

      console.error(error);

      alert("Đăng ảnh thất bại");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div
      className="
        absolute
        inset-0
        z-[100]
        bg-black
      "
    >

      <Image
        src={image}
        alt="Preview"
        fill
        unoptimized
        className="object-cover"
      />

      <div
        className="
          absolute
          bottom-8
          left-0
          flex
          w-full
          gap-4
          px-6
        "
      >

        <button
          disabled={loading}
          onClick={clearImage}
          className="
            flex-1
            rounded-xl
            bg-white
            py-4
            font-semibold
            disabled:opacity-50
          "
        >
          Chụp lại
        </button>

        <button
          disabled={loading}
          onClick={handleUpload}
          className="
            flex-1
            rounded-xl
            bg-blue-500
            py-4
            font-semibold
            text-white
            disabled:opacity-50
          "
        >
          {
            loading
              ? "Đang đăng..."
              : "Đăng"
          }
        </button>

      </div>

    </div>

  );

}