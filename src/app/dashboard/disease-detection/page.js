"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Loader2, AlertCircle } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function DiseaseDetectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setDetectionResult(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setDetectionResult(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setDetectionResult(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/disease-detection", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to detect disease");
      }

      const data = await response.json();
      setDetectionResult(data);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to detect disease. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative p-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 animate-gradient-x"></div>

        {/* Dot pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large gradient orbs */}
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-300/30 to-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-300/30 to-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Light beam effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <motion.div
        className="max-w-4xl mx-auto space-y-8 relative z-10"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="hover:bg-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Disease Detection
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-black/70 to-gray-900/70 border border-white/40 shadow-2xl backdrop-blur-md rounded-xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Disease Detection
          </h2>

          <p className="text-white/80 text-center mb-8">
            Upload an image of your plant to detect potential diseases
          </p>

          <form className="space-y-6" onSubmit={handleImageUpload}>
            <div
              className="border-2 border-dashed border-white/40 rounded-xl p-6 text-center text-white/70 bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors duration-200"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Upload className="w-10 h-10 text-white/60" />
                  <p className="text-lg font-semibold">
                    Drag & Drop Image Here
                  </p>
                  <p className="text-sm">(or click to select file)</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-center text-sm flex items-center justify-center space-x-2 bg-red-900/20 border border-red-400/30 rounded-md p-2 backdrop-blur-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 rounded-md shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              disabled={loading || !selectedFile}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Detect Disease"
              )}
            </Button>
          </form>

          {detectionResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-gradient-to-br from-black/70 to-gray-900/70 border border-white/40 backdrop-blur-md rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Detection Results:
              </h3>
              <p className="text-white/90 text-lg mb-2">
                <span className="font-semibold">Disease Detected:</span>{" "}
                {detectionResult.disease}
              </p>
              <p className="text-white/80 text-md mb-4">
                <span className="font-semibold">Confidence:</span>{" "}
                {detectionResult.confidence}%
              </p>

              {/* Removed Description Section */}
              {/* Removed Treatment Recommendations Section */}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
