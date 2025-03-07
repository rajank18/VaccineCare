import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoginUserMutation } from "@/features/api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "./Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, LogIn, Shield, Building, Activity, Stethoscope, Syringe } from "lucide-react";

const particles = Array.from({ length: 50 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  duration: Math.random() * 5 + 3,
  delay: Math.random() * 2,
}));

const lightBeams = Array.from({ length: 15 }).map(() => ({
  x: Math.random() * 100,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
  width: Math.random() * 2 + 1,
  opacity: Math.random() * 0.3 + 0.1,
}));

const orbs = Array.from({ length: 8 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 300 + 100,
  duration: Math.random() * 10 + 5,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.2 + 0.1,
}));

const medicalIcons = Array.from({ length: 10 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  icon: Math.random() > 0.5 ? <Syringe className="h-6 w-6 text-blue-500" /> : <Stethoscope className="h-6 w-6 text-green-500" />,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 3,
}));

const roleCards = [
  {
    title: "Government",
    icon: <Building className="h-6 w-6 text-blue-600" />,
    description: "Monitor vaccination coverage and manage distribution policies.",
    color: "bg-blue-100"
  },
  {
    title: "Hospitals",
    icon: <Activity className="h-6 w-6 text-green-600" />,
    description: "Manage vaccine inventory and generate official certificates.",
    color: "bg-green-100"
  },
  {
    title: "Healthcare Workers",
    icon: <Stethoscope className="h-6 w-6 text-purple-600" />,
    description: "Record vaccine doses and update patient information securely.",
    color: "bg-purple-100"
  }
];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [loginUser, { isLoading, isSuccess }] = useLoginUserMutation();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await loginUser({ email, password }).unwrap();
      toast.success("Login successful! Redirecting...");
    } catch (err) {
      setError(err?.data?.message || "Login failed! Try again.");
      toast.error(err?.data?.message || "Login failed! Try again.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-blue-700"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
              y: [`${particle.y}%`, `${particle.y - 20}%`],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {lightBeams.map((beam, i) => (
          <motion.div
            key={`beam-${i}`}
            className="absolute bg-gradient-to-b from-transparent via-blue-700 to-transparent"
            style={{
              left: `${beam.x}%`,
              width: `${beam.width}px`,
              height: '100%',
              opacity: beam.opacity,
            }}
            animate={{
              y: ['-100%', '100%'],
              opacity: [0, beam.opacity, 0],
            }}
            transition={{
              duration: beam.duration,
              delay: beam.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {orbs.map((orb, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: `radial-gradient(circle, rgba(29, 78, 216, ${orb.opacity}) 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [orb.opacity, orb.opacity * 1.5, orb.opacity],
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Medical Icons Animation */}
        {medicalIcons.map((icon, i) => (
          <motion.div
            key={`med-${i}`}
            className="absolute"
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
            }}
            animate={{
              y: [`${icon.y}%`, `${icon.y + 20}%`],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: icon.duration,
              delay: icon.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {icon.icon}
          </motion.div>
        ))}
      </div>

      {/* Dual Card Layout with Equal Height */}
      <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-[calc(100vh-64px)] px-4 relative z-10 gap-8 py-12">
        {/* Vaccine Info Card */}
        <motion.div
          className="w-full lg:w-1/2 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/90 shadow-2xl border-0 h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="p-4 bg-blue-100 rounded-xl"
                >
                  <Shield className="h-12 w-12 text-blue-600" />
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  VaccineCare System
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div className="space-y-4">
                <p className="text-lg text-gray-600">
                  Nationwide vaccine management features:
                </p>
                <ul className="space-y-3 list-disc pl-6 text-gray-600">
                  <li>Real-time vaccination tracking</li>
                  <li>Digital certification system</li>
                  <li>Multi-layer security protocols</li>
                  <li>National coverage analytics</li>
                </ul>
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-semibold text-gray-800">System Roles</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {roleCards.map((role, i) => (
                    <motion.div
                      key={role.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <Card className={`${role.color} border-0 shadow-sm`}>
                        <CardContent className="p-4 flex items-center gap-4">
                          {role.icon}
                          <div>
                            <h4 className="font-semibold text-gray-800">{role.title}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          className="w-full lg:w-1/2 max-w-md h-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="backdrop-blur-xl bg-white/90 shadow-2xl border-0 h-full flex flex-col relative overflow-hidden">
            {/* Syringe Animation */}
            <motion.div
              className="absolute -top-20 -right-20 text-blue-500 opacity-20"
              animate={{
                rotate: [0, 45, 90, 135, 180],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Syringe className="h-40 w-40" />
            </motion.div>

            {/* Stethoscope Animation */}
            <motion.div
              className="absolute -bottom-20 -left-20 text-green-500 opacity-20"
              animate={{
                rotate: [0, -45, -90, -135, -180],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Stethoscope className="h-40 w-40" />
            </motion.div>

            <CardHeader className="space-y-3 pb-2">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mx-auto flex items-center justify-center"
              >
                <LogIn className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                Secure Access Portal
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-4 flex-1 h-fit">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div>

                <form onSubmit={handleSignup} className="space-y-4 h-fit">
                  <div className="space-y-2 h-fit" >
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/70 focus:bg-white transition-all duration-300"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-700 transition-colors" />
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-white/70 focus:bg-white transition-all duration-300"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-700 transition-colors" />
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Authenticating...
                        </div>
                      ) : (
                        "Access Secure Dashboard"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>


              <motion.div
                className="pt-4 text-center"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="text-xs text-gray-500">
                  TEAM EUREKA 2025
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;