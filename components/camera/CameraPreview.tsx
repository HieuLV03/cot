"use client";

import { useState } from "react";
import Image from "next/image";
import { useCameraStore } from "@/store/camera.store";
import { createClient } from "@/lib/supabase/client";

export default function CameraPreview() {
  const image = useCameraStore((state) => state.image);
  const file = useCameraStore((state) => state.file);
  const isPreview = useCameraStore((state) => state.isPreview);

  const clearImage = useCameraStore((state) => state.clearImage);
  const closeCamera = useCameraStore((state) => state.closeCamera);

  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  if (!isPreview || !image || !file) {
    return null;
  }

  async function handleUpload() {
    if (!file) return;

    try {
      setLoading(true);

      // 1. Tạo tên file unique
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // 2. Upload lên Storage
      const { error: uploadError } = await supabase.storage
        .from("photos")           // ← Đảm bảo bucket này tồn tại
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 3. Lấy Public URL
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      console.log("✅ Public URL:", publicUrl);

      // ==================== PHẦN QUAN TRỌNG ====================
      // 4. Lưu thông tin vào Database
      const { error: dbError } = await supabase
        .from("photos")           // ← Tên bảng trong Database
        .insert({
          url: publicUrl,         // cột chứa link ảnh
          // user_id: user?.id,   // nếu có auth
          // caption: "",         // nếu có mô tả
          // created_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      alert("✅ Đăng ảnh thành công!");
      
      clearImage();
      closeCamera();

    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Đăng ảnh thất bại: " + (error.message || ""));
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