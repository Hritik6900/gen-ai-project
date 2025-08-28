"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Clock, SkipForward } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { quizService } from "@/lib/firestore"

interface Question {
  id: number
  question: string
  options: string[]
  category: "technical" | "analytical" | "creative" | "leadership" | "communication"
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "When faced with a complex problem, what's your first approach?",
    options: [
      "Break it down into smaller, manageable parts",
      "Research similar problems and solutions",
      "Brainstorm creative alternatives",
      "Consult with team members for input",
    ],
    category: "analytical",
  },
  {
    id: 2,
    question: "Which type of project excites you most?",
    options: [
      "Building a new software application",
      "Analyzing data to find insights",
      "Designing user interfaces",
      "Leading a team to achieve goals",
    ],
    category: "technical",
  },
  {
    id: 3,
    question: "How do you prefer to learn new technologies?",
    options: [
      "Hands-on experimentation and building",
      "Reading documentation and tutorials",
      "Watching video courses",
      "Learning from mentors and peers",
    ],
    category: "technical",
  },
  {
    id: 4,
    question: "In a team setting, you naturally tend to:",
    options: [
      "Take charge and organize tasks",
      "Provide technical expertise",
      "Generate innovative ideas",
      "Facilitate communication between members",
    ],
    category: "leadership",
  },
  {
    id: 5,
    question: "What motivates you most in your work?",
    options: [
      "Solving challenging technical problems",
      "Creating something visually appealing",
      "Making data-driven decisions",
      "Helping others achieve their goals",
    ],
    category: "creative",
  },
  {
    id: 6,
    question: "When presenting ideas, you prefer to:",
    options: [
      "Use detailed technical explanations",
      "Show visual mockups and prototypes",
      "Present data and analytics",
      "Tell compelling stories",
    ],
    category: "communication",
  },
  {
    id: 7,
    question: "Your ideal work environment is:",
    options: [
      "Quiet space for deep focus",
      "Collaborative open office",
      "Flexible remote setup",
      "Dynamic, fast-paced environment",
    ],
    category: "analytical",
  },
  {
    id: 8,
    question: "When debugging code, you typically:",
    options: [
      "Use systematic debugging tools",
      "Add console logs strategically",
      "Review code line by line",
      "Ask colleagues for fresh perspective",
    ],
    category: "technical",
  },
]

interface AptitudeQuizProps {
  onComplete: (results: any) => void
  onSkip: () => void
}

export function AptitudeQuiz({ onComplete, onSkip }: AptitudeQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const { user } = useAuth()

  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNext = async () => {
    if (selectedAnswer !== null) {
      setAnswers({ ...answers, [currentQuestion]: selectedAnswer })

      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        // Quiz completed, calculate results
        const finalAnswers = { ...answers, [currentQuestion]: selectedAnswer }
        const results = calculateResults(finalAnswers)

        if (user) {
          try {
            await quizService.saveQuizResults(user.uid, results)
            console.log("Quiz results saved to Firestore")
          } catch (error) {
            console.error("Error saving quiz results:", error)
          }
        }

        onComplete(results)
      }
    }
  }

  const calculateResults = (answers: Record<number, number>) => {
    const categoryScores: Record<string, number> = {
      technical: 0,
      analytical: 0,
      creative: 0,
      leadership: 0,
      communication: 0,
    }

    Object.entries(answers).forEach(([questionIndex, answerIndex]) => {
      const question = QUIZ_QUESTIONS[Number.parseInt(questionIndex)]
      categoryScores[question.category] += 1
    })

    // Convert to percentages
    const totalQuestions = QUIZ_QUESTIONS.length
    const percentageScores = Object.entries(categoryScores).map(([category, score]) => ({
      category,
      score: Math.round((score / totalQuestions) * 100),
    }))

    return {
      categoryScores: percentageScores,
      completedAt: new Date(),
      totalQuestions,
      answers,
    }
  }

  const question = QUIZ_QUESTIONS[currentQuestion]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-primary mb-4 glow-green">Aptitude Assessment</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Answer these questions to help us understand your strengths and recommend the best career paths.
        </p>
      </div>

      <Card className="bg-card border-primary/20 glow-green max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              ~5 min
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-foreground mb-4">{question.question}</h3>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      className="border-primary/30 text-primary"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-foreground hover:text-primary transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={onSkip}
              className="border-muted-foreground/20 hover:border-primary/50 bg-transparent"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Assessment
            </Button>

            <Button onClick={handleNext} disabled={selectedAnswer === null} className="glow-green">
              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "Complete Assessment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
