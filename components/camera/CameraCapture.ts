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
  quality = 0.93,
}: CaptureOptions): Promise<CaptureResult> {

  if (video.readyState < 2) {
    throw new Error("Camera chưa sẵn sàng");
  }

  // Lấy độ phân giải thực tế của video
  let width = video.videoWidth;
  let height = video.videoHeight;

  // Tăng độ phân giải nếu quá thấp
  if (width < 1280) {
    width = 1280;
    height = Math.round((video.videoHeight * width) / video.videoWidth);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { 
    alpha: false 
  });

  if (!ctx) {
    throw new Error("Không tạo được Canvas");
  }

  ctx.save();

  if (facingMode === "user") {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(video, 0, 0, width, height);
  ctx.restore();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Không tạo được Blob"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });

  const file = new File([blob], `photo-${Date.now()}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  const preview = URL.createObjectURL(blob);

  return { file, preview };
}