"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Image from "next/image";
import { Upload } from "lucide-react";

const DragAndDropUploader = ({ onImageSelect, setPreview, preview }) => {
  const [isDragging, setIsDragging] = useState(false);
  // To store the image preview

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFile(droppedFile);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result; // Data URL
      setPreview(base64Image);
      onImageSelect(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="relative">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          "border-2 border-dashed p-6 text-center rounded-md transition-all cursor-pointer mb-4 h-[390px]",
          isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
        )}
      >
        {!preview ? (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600">
              Drag and drop an image here, or click to select
            </p>
            <Upload className="m-8 size-10" />
          </div>
        ) : (
          <Image
            src={preview}
            alt="Preview"
            width={300} // Specify the width
            height={320} // Specify the height
            className="max-w-full  max-h-full mt-2 rounded-md object-contain m-auto"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="underline text-blue-600 cursor-pointer"
        >
          {preview ? "Change image" : "Select from computer"}
        </label>
      </div>
      {preview && (
        <Button
          variant="ghost"
          onClick={() => {
            setPreview(null);
            onImageSelect(null);
          }}
          className="text-red-600 bg-black mb-2 absolute right-2 top-2 "
        >
          X
        </Button>
      )}
    </div>
  );
};

export default DragAndDropUploader;
