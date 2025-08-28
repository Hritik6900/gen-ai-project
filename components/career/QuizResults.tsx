"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Lightbulb, Users, MessageSquare, Code } from "lucide-react"

interface QuizResultsProps {
  skills: string[]
  quizResults: any
  skippedQuiz: boolean
  onViewProspects: () => void
}

const CATEGORY_INFO = {
  technical: {
    icon: Code,
    label: "Technical Skills",
    description: "Problem-solving and technical implementation",
    color: "text-blue-400",
  },
  analytical: {
    icon: Target,
    label: "Analytical Thinking",
    description: "Data analysis and logical reasoning",
    color: "text-green-400",
  },
  creative: {
    icon: Lightbulb,
    label: "Creative Problem Solving",
    description: "Innovation and design thinking",
    color: "text-purple-400",
  },
  leadership: {
    icon: Users,
    label: "Leadership",
    description: "Team management and strategic thinking",
    color: "text-orange-400",
  },
  communication: {
    icon: MessageSquare,
    label: "Communication",
    description: "Presentation and interpersonal skills",
    color: "text-pink-400",
  },
}

const getSkillBasedAdvice = (skills: string[]) => {
  const hasWebDev = skills.some((skill) =>
    ["JavaScript", "React", "HTML", "CSS", "Node.js", "Vue.js", "Angular"].includes(skill),
  )
  const hasDataSkills = skills.some((skill) =>
    ["Python", "SQL", "Data Analysis", "Machine Learning", "R"].includes(skill),
  )
  const hasDesignSkills = skills.some((skill) => ["UI/UX Design", "Figma", "Adobe", "Design"].includes(skill))
  const hasBackendSkills = skills.some((skill) => ["Node.js", "Python", "Java", "C++", "Go", "Rust"].includes(skill))

  if (hasWebDev && hasDesignSkills) {
    return {
      title: "Full-Stack Designer",
      description:
        "Your combination of web development and design skills makes you perfect for roles that bridge technical implementation with user experience.",
      recommendations: [
        "Consider Frontend Developer or Full-Stack Developer roles",
        "Explore UI/UX Developer positions",
        "Look into Product Designer roles at tech companies",
      ],
    }
  }

  if (hasDataSkills) {
    return {
      title: "Data Professional",
      description:
        "Your data analysis and programming skills position you well for the growing field of data science and analytics.",
      recommendations: [
        "Explore Data Analyst or Data Scientist positions",
        "Consider Machine Learning Engineer roles",
        "Look into Business Intelligence Developer positions",
      ],
    }
  }

  if (hasWebDev) {
    return {
      title: "Web Developer",
      description: "Your web development skills are in high demand across all industries.",
      recommendations: [
        "Apply for Frontend or Full-Stack Developer roles",
        "Consider React/Vue.js Developer positions",
        "Explore opportunities at startups and tech companies",
      ],
    }
  }

  return {
    title: "Tech Professional",
    description: "Your diverse skill set opens up many opportunities in the technology sector.",
    recommendations: [
      "Consider roles that match your strongest skills",
      "Look for positions that allow skill growth",
      "Explore different areas to find your passion",
    ],
  }
}

export function QuizResults({ skills, quizResults, skippedQuiz, onViewProspects }: QuizResultsProps) {
  const skillAdvice = getSkillBasedAdvice(skills)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-primary mb-4 glow-green">
          {skippedQuiz ? "Skills Analysis" : "Your Assessment Results"}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {skippedQuiz
            ? "Based on your skills, here's our analysis and recommendations."
            : "Here's your personalized analysis based on your skills and assessment results."}
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {/* Skills Summary */}
        <Card className="bg-card border-primary/20 glow-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your Skills Profile
            </CardTitle>
            <CardDescription>{skills.length} skills identified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary border border-primary/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Results or Skill-based Analysis */}
        {!skippedQuiz && quizResults ? (
          <Card className="bg-card border-primary/20 glow-green">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Aptitude Breakdown
              </CardTitle>
              <CardDescription>Your strengths across different categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quizResults.categoryScores.map((category: any) => {
                const info = CATEGORY_INFO[category.category as keyof typeof CATEGORY_INFO]
                const Icon = info.icon

                return (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${info.color}`} />
                        <span className="font-medium text-foreground">{info.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{category.score}%</span>
                    </div>
                    <Progress value={category.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-primary/20 glow-green">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                {skillAdvice.title}
              </CardTitle>
              <CardDescription>Personalized recommendations based on your skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">{skillAdvice.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Recommendations:</h4>
                <ul className="space-y-1">
                  {skillAdvice.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <Button onClick={onViewProspects} size="lg" className="glow-green-intense">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Career Prospects
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
