"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Droplet } from "lucide-react";
import { useSensorData } from "@/hooks/sensorData";
// --- NEW: Import Select components ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// --- NEW: Define options for both dropdowns ---
const SOIL_TYPE_OPTIONS = [
  "Loamy",
  "Sandy",
  "Clay",
  "Silty",
  "Peaty",
  "Chalky",
  "Laterite",
];

const CROP_OPTIONS = [
  "Rice",
  "Wheat",
  "Maize",
  "Cotton",
  "Sugarcane",
  "Potatoes",
  "Tomatoes",
  "Soybean",
  "Groundnut",
  "Tea",
  "Coffee",
  "Banana",
];

export default function FertilizerGuidePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  // --- NEW: State for both selections ---
  const [selectedSoilType, setSelectedSoilType] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");

  const { sensorData, loading: sensorLoading } = useSensorData();

  const handleSubmit = async () => {
    if (!sensorData) {
      alert("Sensor data is not yet available. Please wait.");
      return;
    }
    setLoading(true);
    setRecommendations(null);
    try {
      const response = await fetch("/api/fertilizer-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- MODIFIED: Send sensor data, soil type, and crop ---
        body: JSON.stringify({
          ...sensorData,
          soilType: selectedSoilType,
          crop: selectedCrop,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative p-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>
      
      {/* Content */}
      <motion.div
        className="max-w-4xl mx-auto space-y-8 relative z-10"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hover:bg-white/20" onClick={() => router.back()}>
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
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Live Sensor Data</h2>
            <p className="text-white/80 mt-2">
              Using real-time NPK and soil data for recommendations.
            </p>
          </div>

          {/* Sensor Data Display */}
          <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
            {sensorLoading ? (
              <p className="text-white/80 text-center">Fetching live sensor data...</p>
            ) : sensorData ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white text-center">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-lg">{sensorData.npk?.nitrogen}</span>
                  <span className="text-sm text-white/70">Nitrogen (N)</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-lg">{sensorData.npk?.phosphorus}</span>
                  <span className="text-sm text-white/70">Phosphorus (P)</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-lg">{sensorData.npk?.potassium}</span>
                  <span className="text-sm text-white/70">Potassium (K)</span>
                </div>
              </div>
            ) : (
              <p className="text-red-400 text-center">Could not load sensor data.</p>
            )}
          </div>

          {/* --- NEW: Dropdown Menus for Soil and Crop --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="soil-select" className="font-medium text-white/80">
                Soil Type
              </label>
              <Select value={selectedSoilType} onValueChange={setSelectedSoilType}>
                <SelectTrigger id="soil-select" className="w-full bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select soil..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  {SOIL_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="crop-select" className="font-medium text-white/80">
                Crop Type
              </label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger id="crop-select" className="w-full bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select crop..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  {CROP_OPTIONS.map((crop) => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 rounded-md shadow-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            // --- MODIFIED: Button disabled until all data is available and selected ---
            disabled={loading || sensorLoading || !sensorData || !selectedSoilType || !selectedCrop}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Get Fertilizer Recommendations"
            )}
          </Button>
        </motion.div>

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
             <ul className="divide-y divide-white/20">
               {recommendations.fertilizers.map((fertilizer, index) => (
                 <li key={index} className="flex items-start space-x-3 py-3">
                   <Droplet className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                   <div>
                     <p className="font-semibold text-white">{fertilizer.name} ({fertilizer.npk})</p>
                     <p className="text-sm text-white/70">{fertilizer.reason}</p>
                     <p className="text-xs text-white/60 mt-1">{fertilizer.application}</p>
                   </div>
                 </li>
               ))}
             </ul>
             {recommendations.notes && (
               <p className="mt-4 text-white/70 text-sm border-t border-white/20 pt-3">
                 <strong>Important Note:</strong> {recommendations.notes}
               </p>
             )}
           </motion.div>
        )}
      </motion.div>
    </div>
  );
}