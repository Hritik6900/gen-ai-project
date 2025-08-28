"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Sparkles } from "lucide-react"

interface SkillsInputProps {
  initialSkills: string[]
  onComplete: (skills: string[]) => void
}

const SUGGESTED_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "SQL",
  "Git",
  "AWS",
  "Docker",
  "MongoDB",
  "GraphQL",
  "Vue.js",
  "Angular",
  "Java",
  "C++",
  "Machine Learning",
  "Data Analysis",
  "UI/UX Design",
  "Project Management",
  "Agile",
  "DevOps",
  "Kubernetes",
  "Firebase",
  "Next.js",
  "Express.js",
]

export function SkillsInput({ initialSkills, onComplete }: SkillsInputProps) {
  const [skills, setSkills] = useState<string[]>(initialSkills)
  const [inputValue, setInputValue] = useState("")

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill])
    }
    setInputValue("")
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(inputValue)
    }
  }

  const handleComplete = () => {
    if (skills.length > 0) {
      onComplete(skills)
    }
  }

  const availableSuggestions = SUGGESTED_SKILLS.filter((skill) => !skills.includes(skill))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-primary mb-4 glow-green">Tell Us About Your Skills</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Add your current skills to help us understand your expertise and recommend the best career paths for you.
        </p>
      </div>

      <Card className="bg-card border-primary/20 glow-green">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Your Skills
          </CardTitle>
          <CardDescription>Add skills by typing and pressing Enter, or click on suggestions below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Field */}
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill and press Enter..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleInputKeyPress}
              className="flex-1 bg-input border-border focus:border-primary"
            />
            <Button onClick={() => addSkill(inputValue)} disabled={!inputValue.trim()} size="sm" className="glow-green">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Skills */}
          {skills.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Your Skills ({skills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-primary/70">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Skills */}
          {availableSuggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Suggested Skills</h4>
              <div className="flex flex-wrap gap-2">
                {availableSuggestions.slice(0, 15).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
                    onClick={() => addSkill(skill)}
                  >
                    {skill}
                    <Plus className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={handleComplete} disabled={skills.length === 0} size="lg" className="glow-green-intense">
              Continue to Assessment
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
