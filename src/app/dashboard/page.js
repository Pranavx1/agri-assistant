"use client";

import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Droplet, Camera, Lightbulb } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

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
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-green-300/30 to-emerald-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-300/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-300/30 to-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

          {/* Small floating elements */}
          <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float animation-delay-1000"></div>
          <div className="absolute top-2/3 right-1/4 w-36 h-36 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float animation-delay-2000"></div>
        </div>

        {/* Light beam effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <motion.div
        className="max-w-7xl mx-auto space-y-8 relative z-10"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <motion.div className="text-center space-y-2" variants={fadeIn}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 text-lg">
            Here&apos;s an overview of your agricultural assistant
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Crop Recommendations",
              description: "Get personalized crop suggestions",
              icon: <Leaf className="w-6 h-6" />,
              gradient: "from-green-400/90 to-emerald-500/90",
              path: "/dashboard/crops",
            },
            {
              title: "Fertilizer Guide",
              description: "Find the right fertilizers for your crops",
              icon: <Droplet className="w-6 h-6" />,
              gradient: "from-blue-400/90 to-cyan-500/90",
              path: "/dashboard/fertilizers",
            },
            {
              title: "Disease Detection",
              description: "Upload plant images for analysis",
              icon: <Camera className="w-6 h-6" />,
              gradient: "from-purple-400/90 to-indigo-500/90",
              path: "/dashboard/disease-detection",
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border border-white/20 shadow-xl backdrop-blur-md bg-white/10 hover:shadow-2xl transition-shadow duration-300">
                <CardHeader
                  className={`bg-gradient-to-br ${card.gradient} text-white rounded-t-lg backdrop-blur-sm`}
                >
                  <div className="flex items-center space-x-2">
                    {card.icon}
                    <CardTitle className="text-white">{card.title}</CardTitle>
                  </div>
                  <CardDescription className="text-white/90">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Button
                    onClick={() => router.push(card.path)}
                    className={`w-full bg-gradient-to-r ${card.gradient} text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:scale-[1.02] hover:brightness-110`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        >
          <Card className="border border-white/20 shadow-xl backdrop-blur-md bg-white/10 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-br from-amber-400/90 to-orange-500/90 text-white rounded-t-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-6 h-6" />
                <CardTitle className="text-white">Quick Tips</CardTitle>
              </div>
              <CardDescription className="text-white/90">
                Helpful advice for better results
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {[
                  "Upload clear images for accurate disease detection",
                  "Check soil conditions before applying fertilizers",
                  "Keep track of your crop growth stages",
                ].map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-2 text-gray-600"
                  >
                    <span className="w-2 h-2 bg-orange-400 rounded-full" />
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
