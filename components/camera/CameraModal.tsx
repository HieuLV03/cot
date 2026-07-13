"use client";

import { X } from "lucide-react";

import { useCameraStore } from "@/store/camera.store";
import CameraView from "./CameraView";


export default function CameraModal() {

  const isOpen = useCameraStore(
    state => state.isOpen
  );

  const closeCamera = useCameraStore(
    state => state.closeCamera
  );
const facingMode = useCameraStore(
  state => state.facingMode
);

<CameraView
  facingMode={facingMode}
/>

  if (!isOpen) return null;


  return (
    <div className="
      fixed
      inset-0
      z-50
      bg-black
    ">


      <CameraView
        facingMode="environment"
      />


      <button
        onClick={closeCamera}
        className="
          absolute
          right-5
          top-5
          rounded-full
          bg-white/20
          p-3
        "
      >
        <X color="white"/>
      </button>


    </div>
  );
}