export type CaptureResult = {
  file: File;
  preview: string;
};

export async function capturePhoto(
  video: HTMLVideoElement
): Promise<CaptureResult> {

  if (!video.videoWidth || !video.videoHeight) {
    throw new Error("Camera chưa sẵn sàng");
  }

  const canvas = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Không thể tạo Canvas");
  }

  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise<Blob>((resolve, reject) => {

    canvas.toBlob(
      (blob) => {

        if (!blob) {
          reject(
            new Error("Không thể tạo ảnh")
          );
          return;
        }

        resolve(blob);

      },
      "image/jpeg",
      0.9
    );

  });

  const file = new File(
    [blob],
    `${Date.now()}.jpg`,
    {
      type: "image/jpeg",
    }
  );

  const preview = URL.createObjectURL(blob);

  return {
    file,
    preview,
  };

}