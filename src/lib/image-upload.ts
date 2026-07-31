"use client";

/**
 * Resizes and compresses an image file entirely in the browser (canvas),
 * returning a base64 data URL. This is what backs every image upload in
 * the dashboard (Product Management, Website Builder blocks) — there's
 * no image host or CDN wired up, uploaded images live as data URLs in
 * whatever holds the record (product state, block state), and get
 * embedded directly into exported/deployed HTML.
 *
 * Honest tradeoff: fine for a handful of product/section photos, not
 * how you'd want to ship dozens of full-res images to production —
 * data URLs bloat page weight since there's no caching or lazy loading
 * story for them the way a real CDN-hosted <img src> gets. Resizing to
 * maxWidth and compressing to JPEG keeps this reasonable for now.
 */
export function resizeImageFile(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Couldn't decode the image."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas isn't supported here."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const MAX_UPLOAD_SIZE_BYTES = 8 * 1024 * 1024; // 8MB, before resizing
