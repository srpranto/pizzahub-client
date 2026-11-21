"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileDropProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export function FileDrop({
  value = [],
  onChange,
  maxFiles = 4,
  className,
  disabled = false,
}: FileDropProps) {
  const [uploading, setUploading] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    if (value.length + files.length > maxFiles) {
      toast.error(`You can upload at most ${maxFiles} images`);
      return;
    }

    try {
      setUploading(true);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file && file.type.startsWith("image/")) {
          const url = await uploadToImgBB(file);
          newUrls.push(url);
        }
      }

      onChange([...value, ...newUrls]);
      toast.success("Image(s) uploaded successfully");
    } catch {
      toast.error("Failed to upload image. Please check format or size.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!disabled && !uploading && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-semibold">Uploading to ImgBB...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to 5MB (Max {maxFiles} images)
            </p>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted"
            >
              <Image
                src={url}
                alt={`Upload preview ${idx + 1}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
