"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { SkillsInput } from "@/components/career/SkillsInput"
import { AptitudeQuiz } from "@/components/career/AptitudeQuiz"
import { QuizResults } from "@/components/career/QuizResults"
import { JobProspects } from "@/components/career/JobProspects"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

type FlowStep = "skills" | "quiz" | "results" | "prospects"

export default function CareerPage() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("skills")
  const [skills, setSkills] = useState<string[]>([])
  const [quizResults, setQuizResults] = useState<any>(null)
  const [skippedQuiz, setSkippedQuiz] = useState(false)
  const { userProfile, updateUserProfile } = useAuth()

  useEffect(() => {
    if (userProfile?.skills) {
      setSkills(userProfile.skills)
    }
    if (userProfile?.quizResults) {
      setQuizResults(userProfile.quizResults)
      setCurrentStep("results")
    }
  }, [userProfile])

  const handleSkillsComplete = async (newSkills: string[]) => {
    setSkills(newSkills)
    await updateUserProfile({ skills: newSkills })
    setCurrentStep("quiz")
  }

  const handleQuizComplete = async (results: any) => {
    setQuizResults(results)
    await updateUserProfile({ quizResults: results })
    setCurrentStep("results")
  }

  const handleQuizSkip = () => {
    setSkippedQuiz(true)
    setCurrentStep("results")
  }

  const handleViewProspects = () => {
    setCurrentStep("prospects")
  }

  const getStepIcon = (step: FlowStep) => {
    switch (step) {
      case "skills":
        return <Target className="w-5 h-5" />
      case "quiz":
        return <Brain className="w-5 h-5" />
      case "results":
        return <TrendingUp className="w-5 h-5" />
      case "prospects":
        return <TrendingUp className="w-5 h-5" />
    }
  }

  const getStepTitle = (step: FlowStep) => {
    switch (step) {
      case "skills":
        return "Your Skills"
      case "quiz":
        return "Aptitude Assessment"
      case "results":
        return "Analysis Results"
      case "prospects":
        return "Career Prospects"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground font-mono">
        {/* Header */}
        <motion.header
          className="p-6 border-b border-border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold text-primary glow-green">Career & Skills</h1>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {(["skills", "quiz", "results", "prospects"] as FlowStep[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      currentStep === step
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : index < (["skills", "quiz", "results", "prospects"] as FlowStep[]).indexOf(currentStep)
                          ? "bg-primary/10 text-primary/70"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getStepIcon(step)}
                    <span className="hidden sm:inline">{getStepTitle(step)}</span>
                  </div>
                  {index < 3 && <div className="w-8 h-px bg-border mx-1" />}
                </div>
              ))}
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentStep === "skills" && <SkillsInput initialSkills={skills} onComplete={handleSkillsComplete} />}

            {currentStep === "quiz" && <AptitudeQuiz onComplete={handleQuizComplete} onSkip={handleQuizSkip} />}

            {currentStep === "results" && (
              <QuizResults
                skills={skills}
                quizResults={quizResults}
                skippedQuiz={skippedQuiz}
                onViewProspects={handleViewProspects}
              />
            )}

            {currentStep === "prospects" && <JobProspects skills={skills} quizResults={quizResults} />}
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
