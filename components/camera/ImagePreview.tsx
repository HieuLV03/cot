"use client";

import { useState } from "react";
import Image from "next/image";

import { useCameraStore } from "@/store/camera.store";
import { createClient } from "@/lib/supabase/client";

import { compressImage } from "@/utils/compressImage";
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
const supabase = createClient();
  const [loading, setLoading] =
    useState(false);

  if (!isPreview || !image) {
    return null;
  }

async function handleUpload() {

  if (!file) return;

  try {

    setLoading(true);


    // 1. Nén ảnh trước khi upload

    const compressedFile =
      await compressImage(file);



    // 2. Tạo tên file

    const fileName =
      `${Date.now()}.jpg`;



    // 3. Upload Storage

    const {
      error: uploadError
    } =
      await supabase.storage
      .from("photos")
      .upload(
        fileName,
        compressedFile,
        {
          cacheControl:"3600",
          upsert:false,
        }
      );


    if(uploadError){
      throw uploadError;
    }



    // 4. Lấy URL

    const {
      data:urlData
    } =
    supabase.storage
    .from("photos")
    .getPublicUrl(fileName);



    const imageUrl =
      urlData.publicUrl;



    // 5. Lấy user hiện tại

    const {
      data:{
        user
      }
    } =
    await supabase.auth.getUser();



    if(!user){

      throw new Error(
        "Chưa đăng nhập"
      );

    }



    // 6. Lưu DB

    const {
      error:dbError
    } =
    await supabase
    .from("photos")
    .insert({

      image_url:imageUrl,

      user_id:user.id,

    });



    if(dbError){
      throw dbError;
    }



    console.log(
      "Upload thành công",
      imageUrl
    );


    clearImage();

    closeCamera();


  } catch(error:any){

    console.error(error);

    alert(
      "Đăng ảnh thất bại: "
      + error.message
    );


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