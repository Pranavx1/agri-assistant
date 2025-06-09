"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 animate-gradient-x"></div>

        {/* Dot pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-green-300/40 to-emerald-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-cyan-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-300/40 to-indigo-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

          {/* Small floating elements */}
          <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float animation-delay-1000"></div>
          <div className="absolute top-2/3 right-1/4 w-28 h-28 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float animation-delay-2000"></div>
        </div>

        {/* Light beam effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border border-white/20 shadow-2xl backdrop-blur-md bg-white/10">
          <CardHeader className="bg-gradient-to-br from-green-400/90 to-blue-500/90 text-white rounded-t-lg space-y-1 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <LogIn className="w-6 h-6" />
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
            </div>
            <CardDescription className="text-white/90">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/50 border-white/20 focus:border-green-500/50 focus:ring-green-500/50 backdrop-blur-sm"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/50 border-white/20 focus:border-green-500/50 focus:ring-green-500/50 backdrop-blur-sm"
                  />
                </div>
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 bg-red-50/50 p-2 rounded backdrop-blur-sm"
                >
                  {error}
                </motion.p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500/90 to-blue-500/90 hover:from-green-600/90 hover:to-blue-600/90 text-white backdrop-blur-sm"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                )}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
