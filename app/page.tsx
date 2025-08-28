"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Monitor, BookOpen, FileText, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import Link from "next/link"

// 3D Desk Scene Component
function DeskScene({ onObjectClick }: { onObjectClick: (object: string) => void }) {
  const [hoveredObject, setHoveredObject] = useState<string | null>(null)

  // Monitor Object
  function MonitorObject() {
    return (
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh
          position={[0, 0.5, 0]}
          onPointerEnter={() => setHoveredObject("monitor")}
          onPointerLeave={() => setHoveredObject(null)}
          onClick={() => onObjectClick("career")}
          rotation={hoveredObject === "monitor" ? [0, 0.1, 0] : [0, 0, 0]}
        >
          <boxGeometry args={[1.5, 1, 0.1]} />
          <meshStandardMaterial
            color={hoveredObject === "monitor" ? "#39ff14" : "#1f1f1f"}
            emissive={hoveredObject === "monitor" ? "#39ff14" : "#000000"}
            emissiveIntensity={hoveredObject === "monitor" ? 0.2 : 0}
          />
        </mesh>
        {/* Monitor Stand */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </Float>
    )
  }

  // Books Object
  function BooksObject() {
    return (
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.1}>
        <group
          position={[-2, 0, 0]}
          onPointerEnter={() => setHoveredObject("books")}
          onPointerLeave={() => setHoveredObject(null)}
          onClick={() => onObjectClick("courses")}
          rotation={hoveredObject === "books" ? [0, 0.1, 0] : [0, 0, 0]}
        >
          {/* Stack of books */}
          {[0, 0.15, 0.3].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <boxGeometry args={[0.8, 0.1, 1.2]} />
              <meshStandardMaterial
                color={hoveredObject === "books" ? "#39ff14" : ["#2a2a2a", "#1a1a1a", "#333333"][i]}
                emissive={hoveredObject === "books" ? "#39ff14" : "#000000"}
                emissiveIntensity={hoveredObject === "books" ? 0.1 : 0}
              />
            </mesh>
          ))}
        </group>
      </Float>
    )
  }

  // Page Object
  function PageObject() {
    return (
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh
          position={[2, 0.1, 0]}
          rotation={[-Math.PI / 2, 0, hoveredObject === "page" ? 0.1 : 0]}
          onPointerEnter={() => setHoveredObject("page")}
          onPointerLeave={() => setHoveredObject(null)}
          onClick={() => onObjectClick("roadmap")}
        >
          <planeGeometry args={[1, 1.4]} />
          <meshStandardMaterial
            color={hoveredObject === "page" ? "#39ff14" : "#f0f0f0"}
            emissive={hoveredObject === "page" ? "#39ff14" : "#000000"}
            emissiveIntensity={hoveredObject === "page" ? 0.1 : 0}
          />
        </mesh>
      </Float>
    )
  }

  // Desk Surface
  function Desk() {
    return (
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    )
  }

  return (
    <>
      <Desk />
      <MonitorObject />
      <BooksObject />
      <PageObject />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#39ff14" />
      <spotLight position={[0, 10, 5]} angle={0.3} penumbra={1} intensity={1} castShadow color="#39ff14" />
    </>
  )
}

function ParticleBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

function Scene3DFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-background to-card rounded-xl">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout } = useAuth()

  const handleObjectClick = (flow: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setSelectedFlow(flow)
    if (flow === "career") {
      window.location.href = "/career"
    } else if (flow === "courses") {
      window.location.href = "/courses"
    } else if (flow === "roadmap") {
      window.location.href = "/roadmap"
    }
  }

  const handleAuthAction = () => {
    if (user) {
      logout()
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <ParticleBackground />

      <motion.header
        className="relative z-10 p-4 sm:p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-primary glow-green text-glow">FUTURE.LEARN</h1>
          <div className="flex gap-2 sm:gap-6 items-center">
            <Button variant="ghost" className="text-foreground hover:text-primary hidden sm:inline-flex">
              About
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary hidden sm:inline-flex">
              Contact
            </Button>
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
                  Welcome, {user.displayName || user.email}
                </span>
                <Button
                  variant="outline"
                  onClick={handleAuthAction}
                  className="border-primary/20 bg-transparent text-xs sm:text-sm focus-glow"
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button className="glow-green focus-glow text-xs sm:text-sm" onClick={handleAuthAction} size="sm">
                Get Started
              </Button>
            )}
          </div>
        </nav>
      </motion.header>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-responsive-xl font-bold mb-4 sm:mb-6 text-primary glow-green text-glow">
            SHAPE YOUR FUTURE
          </h2>
          <p className="text-responsive-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover your career path, enhance your skills, and build a personalized roadmap to success in the digital
            age.
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-4xl h-64 sm:h-80 lg:h-96 mb-8 sm:mb-12 rounded-xl overflow-hidden glow-green"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Canvas
            camera={{ position: [0, 5, 8], fov: 50 }}
            shadows
            className="bg-gradient-to-b from-background to-card"
          >
            <Suspense fallback={<Scene3DFallback />}>
              <DeskScene onObjectClick={handleObjectClick} />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 4}
              />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </motion.div>

        <motion.div
          className="grid-responsive max-w-4xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href={user ? "/career" : "#"} onClick={!user ? () => setShowAuthModal(true) : undefined}>
            <Card className="p-4 sm:p-6 bg-card border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-green cursor-pointer h-full focus-glow">
              <Monitor className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2">Career & Skills</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Assess your skills and discover career opportunities tailored to your strengths.
              </p>
            </Card>
          </Link>

          <Link href={user ? "/courses" : "#"} onClick={!user ? () => setShowAuthModal(true) : undefined}>
            <Card className="p-4 sm:p-6 bg-card border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-green cursor-pointer h-full focus-glow">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2">Courses</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Access curated courses designed to accelerate your professional growth.
              </p>
            </Card>
          </Link>

          <Link href={user ? "/roadmap" : "#"} onClick={!user ? () => setShowAuthModal(true) : undefined}>
            <Card className="p-4 sm:p-6 bg-card border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-green cursor-pointer h-full focus-glow">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2">Personalized Roadmap</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Get a customized learning path based on your goals and current skill level.
              </p>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            size="lg"
            className="text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 glow-green-intense focus-glow"
            onClick={handleAuthAction}
          >
            Begin Your Journey
          </Button>
        </motion.div>
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
