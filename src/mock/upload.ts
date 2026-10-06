/*
 * Client-side checks for files people pick in the demo. Files are kept in the
 * browser only, so large ones are recorded by name without their contents.
 */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const KEEP_CONTENT_BYTES = 600 * 1024;

export function checkFile(file: File, accept: "image" | "document" | "video") {
  const ok =
    accept === "image"
      ? file.type.startsWith("image/")
      : accept === "video"
        ? file.type.startsWith("video/")
        : file.type.startsWith("image/") || file.type === "application/pdf";
  if (!ok) {
    return accept === "image"
      ? "Please choose an image (JPG, PNG or WEBP)."
      : accept === "video"
        ? "Please choose a video (MP4 or MOV)."
        : "Please choose a PDF or an image.";
  }
  const limit = accept === "video" ? 100 * 1024 * 1024 : MAX_UPLOAD_BYTES;
  if (file.size > limit)
    return `That file is too large. The limit is ${Math.round(limit / 1024 / 1024)} MB.`;
  return null;
}

export function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

/** Keep a document's contents only when it is small enough to store. */
export async function documentData(file: File) {
  return file.size <= KEEP_CONTENT_BYTES ? readAsDataUrl(file) : "";
}

/** Shrink a photo to a small JPEG so it fits in browser storage. */
export async function resizeImage(file: File, max = 520) {
  const src = await readAsDataUrl(file);
  const img = new Image();
  img.src = src;
  await img.decode();
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function downloadFile(name: string, content: string | Blob, type = "text/plain") {
  const blob = typeof content === "string" ? new Blob([content], { type }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
