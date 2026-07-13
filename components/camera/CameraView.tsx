"use client";

import { useEffect, useRef } from "react";

type Props = {
  facingMode: "user" | "environment";
};

export default function CameraView({
  facingMode,
}: Props) {

  const videoRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {

    let stream: MediaStream | undefined;


    async function startCamera() {
      try {

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              exact: facingMode,
            },
          },
          audio: false,
        });


        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }


      } catch (error) {
        console.log(error);
      }
    }


    startCamera();


    return () => {
      stream?.getTracks().forEach(
        track => track.stop()
      );
    };


  }, [facingMode]);


  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="
        h-full
        w-full
        object-cover
      "
    />
  );
}   