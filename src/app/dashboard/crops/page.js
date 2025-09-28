"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Leaf, Thermometer, Droplets } from "lucide-react";
import { useSensorData } from "@/hooks/sensorData"; // Adjust path to your hook

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function CropRecommendationsPage() {
  const router = useRouter();
  // 'loading' is for the recommendation API call
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  // Get live sensor data. 'sensorLoading' is for the initial Firebase fetch.
  const { sensorData, loading: sensorLoading } = useSensorData();

  const handleSubmit = async () => {
    if (!sensorData) {
      alert("Sensor data is not yet available. Please wait.");
      return;
    }
    setLoading(true);
    setRecommendations(null); // Clear previous recommendations
    try {
      const response = await fetch("/api/crop-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the live sensor data to the backend
        body: JSON.stringify(sensorData),
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Crop Recommendations
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
              Using real-time data from your sensors to generate recommendations.
            </p>
          </div>

          {/* Sensor Data Display */}
          <div className="p-4 bg-white/10 border border-white/20 rounded-lg">
            {sensorLoading ? (
              <p className="text-white/80 text-center">Fetching live sensor data...</p>
            ) : sensorData ? (
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-red-400" />
                  <span>Temp: {sensorData.dht?.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <span>Humidity: {sensorData.dht?.humidity}%</span>
                </div>
              </div>
            ) : (
              <p className="text-red-400 text-center">Could not load sensor data.</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-md shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            disabled={loading || sensorLoading || !sensorData}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Get Recommendations"
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
               Recommended Crops:
             </h3>
             <ul className="list-disc list-inside text-white/90 space-y-2">
               {recommendations.crops.map((crop, index) => (
                 <li key={index} className="flex items-center">
                   <Leaf className="w-5 h-5 text-green-400 mr-2" />
                   {crop}
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
    </div>
  );
}