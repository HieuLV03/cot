"use client";

import { forwardRef, useEffect } from "react";

type Props = {
  facingMode: "user" | "environment";
};

const CameraView = forwardRef<HTMLVideoElement, Props>(
  function CameraView({ facingMode }, ref) {
    useEffect(() => {
      let stream: MediaStream | null = null;

      async function startCamera() {
        try {
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }

          const constraints: MediaStreamConstraints = {
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1920, min: 1280 },
              height: { ideal: 1080, min: 720 },
              frameRate: { ideal: 30, min: 24 },
            },
            audio: false,
          };

          stream = await navigator.mediaDevices.getUserMedia(constraints);

          if (ref && typeof ref !== "function" && ref.current) {
            ref.current.srcObject = stream;
            await ref.current.play();
          }
        } catch (error) {
          console.error("Lỗi mở camera:", error);
        }
      }

      startCamera();

      return () => {
        stream?.getTracks().forEach((track) => track.stop());
      };
    }, [facingMode, ref]);

    return (
      <video
        ref={ref}
        autoPlay
        muted
        playsInline
        className={`
          h-full w-full object-cover transition-transform
          ${facingMode === "user" ? "scale-x-[-1]" : ""}
        `}
      />
    );
  }
);

export default CameraView;