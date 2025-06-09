"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Droplet, Loader2 } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function FertilizerGuidePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropType: "",
    soilType: "",
    growthStage: "",
    soilPh: "",
  });
  const [recommendations, setRecommendations] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/fertilizer-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Error:", error);
      // You might want to show an error message to the user here
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Fertilizer Guide
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-black/70 to-gray-900/70 border border-white/40 shadow-2xl backdrop-blur-md rounded-xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Get Fertilizer Recommendations
          </h2>

          <p className="text-white/80 text-center mb-8">
            Fill in the details below to get personalized fertilizer
            recommendations
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cropType" className="text-white/90 mb-2 block">
                  Crop Type
                </Label>
                <Select
                  value={formData.cropType}
                  onValueChange={(value) =>
                    handleInputChange("cropType", value)
                  }
                >
                  <SelectTrigger className="w-full bg-white/10 text-white border border-white/20 backdrop-blur-sm focus:ring-offset-0 focus:ring-transparent">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg text-white border-white/20">
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="soybeans">Soybeans</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="soilType" className="text-white/90 mb-2 block">
                  Soil Type
                </Label>
                <Select
                  value={formData.soilType}
                  onValueChange={(value) =>
                    handleInputChange("soilType", value)
                  }
                >
                  <SelectTrigger className="w-full bg-white/10 text-white border border-white/20 backdrop-blur-sm focus:ring-offset-0 focus:ring-transparent">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg text-white border-white/20">
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loamy">Loamy</SelectItem>
                    <SelectItem value="silt">Silt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="growthStage"
                  className="text-white/90 mb-2 block"
                >
                  Growth Stage
                </Label>
                <Select
                  value={formData.growthStage}
                  onValueChange={(value) =>
                    handleInputChange("growthStage", value)
                  }
                >
                  <SelectTrigger className="w-full bg-white/10 text-white border border-white/20 backdrop-blur-sm focus:ring-offset-0 focus:ring-transparent">
                    <SelectValue placeholder="Select growth stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg text-white border-white/20">
                    <SelectItem value="seedling">Seedling</SelectItem>
                    <SelectItem value="vegetative">Vegetative</SelectItem>
                    <SelectItem value="flowering">Flowering</SelectItem>
                    <SelectItem value="fruiting">Fruiting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="soilPh" className="text-white/90 mb-2 block">
                  Soil pH
                </Label>
                <Input
                  type="number"
                  id="soilPh"
                  placeholder="Enter soil pH"
                  value={formData.soilPh}
                  onChange={(e) => handleInputChange("soilPh", e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 backdrop-blur-sm placeholder:text-white/70 focus-visible:ring-offset-0 focus-visible:ring-transparent"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 rounded-md shadow-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </form>

          {recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-gradient-to-br from-black/70 to-gray-900/70 border border-white/40 backdrop-blur-md rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Recommended Fertilizers:
              </h3>
              <ul className="list-disc list-inside text-white/90 space-y-2">
                {recommendations.fertilizers.map((fertilizer, index) => (
                  <li key={index} className="flex items-center">
                    <Droplet className="w-5 h-5 text-blue-400 mr-2" />
                    <div>
                      <p className="font-semibold">{fertilizer.name}</p>
                      <p className="text-sm text-white/70">
                        {fertilizer.description}
                      </p>
                      <p className="text-xs text-white/60">
                        NPK: {fertilizer.npk}
                      </p>
                      <ul className="list-disc list-inside ml-4 text-xs text-white/50">
                        {fertilizer.application.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
              {recommendations.notes && (
                <p className="mt-4 text-white/70">
                  Notes: {recommendations.notes}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
