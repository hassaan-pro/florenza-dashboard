"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { resizeImageFile, MAX_UPLOAD_SIZE_BYTES } from "@/lib/image-upload";

export function ImageUpload({
  value,
  onChange,
  className,
  aspect = "aspect-square",
  maxWidth = 1200,
}: {
  value: string | undefined;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
  aspect?: string;
  maxWidth?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That's not an image file.");
      return;
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setError("That file's too large, try one under 8MB.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await resizeImageFile(file, maxWidth);
      onChange(dataUrl);
    } catch {
      setError("Couldn't process that image.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("relative group rounded-lg overflow-hidden border border-border", aspect, className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded images are base64 data URLs, not remote assets Next's Image optimizer can handle */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-white/90 px-2.5 py-1.5 text-xs font-medium text-foreground"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="rounded-md bg-white/90 p-1.5 text-foreground"
              aria-label="Remove image"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 transition-colors"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          <span className="text-[11px]">{loading ? "Processing…" : "Upload image"}</span>
        </button>
      )}
      {error && (
        <p className="absolute bottom-1 left-1 right-1 rounded bg-destructive/90 px-1.5 py-0.5 text-[10px] text-white">
          {error}
        </p>
      )}
    </div>
  );
}
