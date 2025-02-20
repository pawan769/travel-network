"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload, X } from "lucide-react";

const MAX_IMAGES = 6; // Max allowed images

const DragAndDropUploader = ({ onImageSelect, setPreview, preview }) => {
  const [isDragging, setIsDragging] = useState(false);

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

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (droppedFiles.length === 0) {
      alert("Please upload a valid image file.");
      return;
    }

    handleFiles(droppedFiles);
  };

  const handleFiles = (files) => {
    if (preview.length >= MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const newPreviews = [...preview];
    const allowedFiles = files.slice(0, MAX_IMAGES - preview.length);

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length <= MAX_IMAGES) {
          setPreview([...newPreviews]);
          onImageSelect([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (files.length > allowedFiles.length) {
      alert(`You can only upload ${MAX_IMAGES} images in total.`);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    handleFiles(files);
  };

  const removeImage = (index) => {
    const updatedPreview = preview.filter((_, i) => i !== index);
    setPreview(updatedPreview);
    onImageSelect(updatedPreview);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed py-6 px-2 text-center w-full rounded-md flex flex-col justify-center items-center cursor-pointer relative
        ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"}
      `}
    >
      {preview.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-600">
            Drag and drop images here, or click to select
          </p>
          <Upload className="m-8 size-16" />
        </div>
      ) : (
        <div
          className="grid grid-cols-2 gap-4 mt-6 overflow-y-auto p-2"
          style={{ maxHeight: "70vh", width: "100%" }} // Makes it scrollable if too tall
        >
          {preview.map((imgSrc, index) => (
            <div key={index} className="relative group">
              <Image
                src={imgSrc}
                alt={`Preview ${index + 1}`}
                width={200}
                height={200}
                className="rounded-md object-cover"
              />
              <Button
                variant="ghost"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black text-red-600 opacity-75 hover:opacity-100"
                size="icon"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        id="fileInput"
        disabled={preview.length >= MAX_IMAGES} // Prevents further selection
      />
      <label
        htmlFor="fileInput"
        className={`underline text-lg cursor-pointer mt-4 ${
          preview.length >= MAX_IMAGES ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
        }`}
      >
        {preview.length >= MAX_IMAGES ? "Maximum images reached" : "Select from computer"}
      </label>
    </div>
  );
};

export default DragAndDropUploader;
