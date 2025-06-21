"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Home, User, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-screen relative z-10">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-500">
          <CardContent className="space-y-8">
            {/* Success Icon */}
            <div className="relative">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-2xl animate-pulse">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-ping opacity-20 mx-auto" />
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                Muvaffaqiyat!
              </h1>
              <p className="text-2xl text-white font-medium">Yuz tanish 100% muvaffaqiyatli o&apos;tkaziltdi</p>
              <p className="text-white/70 text-lg">Sizning shaxsingiz tasdiqlandi va tizimga kirish huquqi berildi</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 my-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-white font-bold text-lg">100%</p>
                <p className="text-white/60 text-sm">Aniqlik</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <User className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <p className="text-white font-bold text-lg">Tasdiqlandi</p>
                <p className="text-white/60 text-sm">Holat</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-bold text-lg">Xavfsiz</p>
                <p className="text-white/60 text-sm">Kirish</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Home className="w-5 h-5 mr-2" />
                Bosh sahifaga qaytish
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Dashboard ga o&apos;tish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
