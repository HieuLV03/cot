"use client";

import { useRef } from "react";

import CameraView from "./CameraView";
import CameraControls from "./CameraControls";
import CameraPreview from "./CameraPreview";

import { useCameraStore } from "@/store/camera.store";

export default function CameraModal() {

  const isOpen = useCameraStore(
    state => state.isOpen
  );

  const facingMode = useCameraStore(
    state => state.facingMode
  );

  const videoRef =
    useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black
      "
    >

      <CameraView
        ref={videoRef}
        facingMode={facingMode}
      />

      <CameraControls
        videoRef={videoRef}
      />

      <CameraPreview />

    </div>

  );

}