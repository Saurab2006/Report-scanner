import { AppError } from "@/lib/errors";

export const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

export function getMaxUploadBytes() {
  const mb = Number(process.env.MAX_UPLOAD_MB || 15);
  return Math.max(1, mb) * 1024 * 1024;
}

export async function validateUploadedFile(file) {
  if (!file) {
    throw new AppError("missing_file", "Please choose a medical report file.", 400);
  }

  if (!SUPPORTED_MIME_TYPES.has(file.type)) {
    throw new AppError("unsupported_file_type", "Only JPG, PNG, and PDF medical reports are supported.", 415);
  }

  if (file.size <= 0) {
    throw new AppError("empty_file", "The selected file is empty. Please upload a valid report.", 400);
  }

  const maxBytes = getMaxUploadBytes();
  if (file.size > maxBytes) {
    throw new AppError(
      "file_too_large",
      `The selected file is too large. Maximum allowed size is ${Math.round(maxBytes / 1024 / 1024)} MB.`,
      413
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  validateMagicBytes(bytes, file.type);
  return bytes;
}

function validateMagicBytes(bytes, mimeType) {
  if (mimeType === "image/png") {
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47;
    if (!isPng) throw corruptedFile();
  }

  if (mimeType === "image/jpeg") {
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
    if (!isJpeg) throw corruptedFile();
  }

  if (mimeType === "application/pdf") {
    const header = bytes.subarray(0, 5).toString("utf8");
    if (header !== "%PDF-") throw corruptedFile();
  }
}

function corruptedFile() {
  return new AppError("corrupted_file", "The file does not look like a valid report file. Please upload a clear JPG, PNG, or PDF.", 400);
}
