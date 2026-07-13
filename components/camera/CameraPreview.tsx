"use client";

import { useState } from "react";
import Image from "next/image";
import { useCameraStore } from "@/store/camera.store";
import { createClient } from "@/lib/supabase/client";
export default function CameraPreview() {
  const image = useCameraStore((state) => state.image);
  const file = useCameraStore((state) => state.file);
  const isPreview = useCameraStore((state) => state.isPreview);
  const supabase = createClient();

  const clearImage = useCameraStore((state) => state.clearImage);
  const closeCamera = useCameraStore((state) => state.closeCamera);

  const [loading, setLoading] = useState(false);

  if (!isPreview || !image || !file) {
    return null;
  }

async function handleUpload() {

  if (!file) return;

  try {

    setLoading(true);

    const fileName =
      `${Date.now()}-${file.name}`;

    const { error } =
      await supabase.storage
        .from("photos")
        .upload(
          fileName,
          file,
          {
            upsert: false,
          }
        );

    if (error) {

      throw error;

    }

    const {
      data
    } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    console.log(data.publicUrl);

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
    <div className="absolute inset-0 z-[100] bg-black">
      <Image
        src={image}
        alt="Preview"
        fill
        unoptimized
        className="object-cover"
      />

      <div className="absolute bottom-8 left-0 flex w-full gap-4 px-6">
        <button
          disabled={loading}
          onClick={clearImage}
          className="flex-1 rounded-xl bg-white py-4 font-semibold disabled:opacity-50"
        >
          Chụp lại
        </button>

        <button
          disabled={loading}
          onClick={handleUpload}
          className="flex-1 rounded-xl bg-blue-500 py-4 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Đang đăng..." : "Đăng"}
        </button>
      </div>
    </div>
  );
}