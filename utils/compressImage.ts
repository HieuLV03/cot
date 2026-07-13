export async function compressImage(
  file: File
): Promise<File> {


  const bitmap =
    await createImageBitmap(file);


  const maxWidth = 1200;


  let width = bitmap.width;
  let height = bitmap.height;


  if(width > maxWidth){

    height =
      height *
      (maxWidth / width);

    width = maxWidth;

  }


  const canvas =
    document.createElement("canvas");


  canvas.width = width;
  canvas.height = height;


  const ctx =
    canvas.getContext("2d");


  if(!ctx)
    throw new Error(
      "Canvas error"
    );


  ctx.drawImage(
    bitmap,
    0,
    0,
    width,
    height
  );


  const blob =
    await new Promise<Blob>(
      resolve =>
        canvas.toBlob(
          b=>resolve(b!),
          "image/jpeg",
          0.8
        )
    );


  return new File(
    [blob],
    "photo.jpg",
    {
      type:"image/jpeg"
    }
  );

}