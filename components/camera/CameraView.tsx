"use client";

import {
  forwardRef,
  useEffect,
} from "react";

type Props = {
  facingMode: "user" | "environment";
};

const CameraView = forwardRef<
  HTMLVideoElement,
  Props
>(function CameraView(
  {
    facingMode,
  },
  ref
) {

  useEffect(() => {

    let stream: MediaStream | null = null;

    async function startCamera() {

      try {

        if (stream) {

          stream
            .getTracks()
            .forEach(track =>
              track.stop()
            );

        }

        stream =
          await navigator.mediaDevices.getUserMedia({

            video: {
              facingMode,
            },

            audio: false,

          });

        if (

          ref &&

          typeof ref !== "function" &&

          ref.current

        ) {

          ref.current.srcObject =
            stream;

          await ref.current.play();

        }

      } catch (error) {

        console.error(error);

      }

    }

    startCamera();

    return () => {

      stream?.getTracks().forEach(
        track => track.stop()
      );

    };

  }, [
    facingMode,
    ref,
  ]);

  return (

    <video

      ref={ref}

      autoPlay

      muted

      playsInline

      className="
        h-full
        w-full
        object-cover
      "

    />

  );

});

export default CameraView;