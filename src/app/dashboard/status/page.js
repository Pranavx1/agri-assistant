"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSensorData } from "@/hooks/sensorData"; // Your existing hook for live data
import { Loader2, Thermometer, Droplets, Zap, ZapOff } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { sensorData, loading: sensorLoading } = useSensorData();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);
        // --- MODIFIED: API route path corrected ---
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch pump history:", error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen relative p-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* Content */}
      <motion.div
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-slate-900 bg-clip-text text-transparent">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Sensor Data Card */}
          <motion.div variants={fadeIn} className="lg:col-span-1 bg-gradient-to-br from-black/70 to-gray-900/70 border border-white/40 shadow-2xl backdrop-blur-md rounded-xl p-6 space-y-4">
            {/* --- MODIFIED: Heading styled --- */}
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Live Sensor Readings
            </h2>
            {sensorLoading ? (
              <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>
            ) : sensorData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="w-6 h-6 text-red-400" />
                    <span className="text-white">Temperature</span>
                  </div>
                  <span className="font-bold text-xl text-white">{sensorData.dht?.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-6 h-6 text-blue-400" />
                    <span className="text-white">Humidity</span>
                  </div>
                  <span className="font-bold text-xl text-white">{sensorData.dht?.humidity}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3"><span className="font-bold text-green-400">N</span><span className="text-white">Nitrogen</span></div>
                  <span className="font-bold text-xl text-white">{sensorData.npk?.nitrogen}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3"><span className="font-bold text-orange-400">P</span><span className="text-white">Phosphorus</span></div>
                  <span className="font-bold text-xl text-white">{sensorData.npk?.phosphorus}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3"><span className="font-bold text-yellow-400">K</span><span className="text-white">Potassium</span></div>
                  <span className="font-bold text-xl text-white">{sensorData.npk?.potassium}</span>
                </div>
              </div>
            ) : (
              <p className="text-red-400 text-center mt-8">Could not load sensor data.</p>
            )}
          </motion.div>

          {/* Pump Activity Card */}
          <motion.div variants={fadeIn} className="lg:col-span-2 bg-gradient-to-br from-black/70 to-gray-900/70 border border-white/40 shadow-2xl backdrop-blur-md rounded-xl p-6">
            {/* --- MODIFIED: Heading styled --- */}
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Pump Activity (Last 24 Hours)
            </h2>
            {historyLoading ? (
              <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>
            ) : (
              <div className="flow-root">
                <ul className="divide-y divide-white/20">
                  {history.length > 0 ? history.map((event) => (
                    <li key={event.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        {event.isActive ? (
                          <Zap className="w-5 h-5 text-green-400" />
                        ) : (
                          <ZapOff className="w-5 h-5 text-red-400" />
                        )}
                        <p className={`font-medium ${event.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          Pump Turned {event.isActive ? 'ON' : 'OFF'}
                        </p>
                      </div>
                      <p className="text-sm text-white/70">
                        {new Date(event.createdAt).toLocaleTimeString()}
                      </p>
                    </li>
                  )) : (
                    <p className="text-center text-white/70 py-10">No pump activity recorded in the last 24 hours.</p>
                  )}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}