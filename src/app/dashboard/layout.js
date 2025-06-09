"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, LogOut, Leaf, Droplet, Camera, User } from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <Leaf className="w-5 h-5" />,
    gradient: "from-green-400 to-emerald-500",
  },
  {
    name: "Crop Recommendations",
    path: "/dashboard/crops",
    icon: <Leaf className="w-5 h-5" />,
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    name: "Fertilizer Guide",
    path: "/dashboard/fertilizers",
    icon: <Droplet className="w-5 h-5" />,
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    name: "Disease Detection",
    path: "/dashboard/disease-detection",
    icon: <Camera className="w-5 h-5" />,
    gradient: "from-orange-400 to-amber-500",
  },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
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

      {/* Main Content */}
      <main className="min-h-screen">
        {/* App Bar */}
        <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Agricultural Assistant
              </h1>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900 hover:bg-white/20 group"
                    onClick={() => router.push(item.path)}
                  >
                    <div
                      className={`p-1 rounded-lg bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform`}
                    >
                      {item.icon}
                    </div>
                    <span className="ml-2">{item.name}</span>
                  </Button>
                ))}
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="relative md:hidden">
                <Button
                  variant="ghost"
                  className="p-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </Button>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl"
                  >
                    <div className="p-4 border-b border-white/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {user?.name}
                          </p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <nav className="p-2">
                      {menuItems.map((item) => (
                        <Button
                          key={item.name}
                          variant="ghost"
                          className="w-full justify-start space-x-3 text-gray-600 hover:text-gray-900 hover:bg-white/20 group"
                          onClick={() => {
                            router.push(item.path);
                            setIsMenuOpen(false);
                          }}
                        >
                          <div
                            className={`p-1 rounded-lg bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform`}
                          >
                            {item.icon}
                          </div>
                          <span>{item.name}</span>
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50/20 mt-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </Button>
                    </nav>
                  </motion.div>
                )}
              </div>

              {/* Desktop Logout Button */}
              <Button
                variant="ghost"
                className="hidden md:flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50/20"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
