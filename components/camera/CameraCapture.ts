export type CaptureResult = {
  file: File;
  preview: string;
};

type CaptureOptions = {
  video: HTMLVideoElement;
  facingMode: "user" | "environment";
  quality?: number;
};

export async function capturePhoto({
  video,
  facingMode,
  quality = 0.9,
}: CaptureOptions): Promise<CaptureResult> {

  if (video.readyState < 2) {
    throw new Error("Camera chưa sẵn sàng");
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) {
    throw new Error("Không lấy được kích thước video");
  }

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Không tạo được Canvas");
  }

  ctx.save();

  // Camera trước
 ctx.drawImage(
  video,
  0,
  0,
  width,
  height
);

  const blob = await new Promise<Blob>((resolve, reject) => {

    canvas.toBlob(

      (blob) => {

        if (!blob) {

          reject(
            new Error("Không tạo được Blob")
          );

          return;

        }

        resolve(blob);

      },

      "image/jpeg",

      quality

    );

  });

  const file = new File(

    [blob],

    `photo-${Date.now()}.jpg`,

    {

      type: "image/jpeg",

      lastModified: Date.now(),

    }

  );

  const preview = URL.createObjectURL(blob);

  return {

    file,

    preview,

  };

}