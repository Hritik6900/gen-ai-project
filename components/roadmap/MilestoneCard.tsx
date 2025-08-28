"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, Clock, Target, BookOpen, Award, Briefcase, Code, CheckCircle } from "lucide-react"
import type { RoadmapMilestone } from "@/app/roadmap/page"

interface MilestoneCardProps {
  milestone: RoadmapMilestone
  onComplete: () => void
  onCheckpointComplete: (checkpointId: string) => void
}

export function MilestoneCard({ milestone, onComplete, onCheckpointComplete }: MilestoneCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const completedCheckpoints = milestone.checkpoints.filter((c) => c.completed).length
  const checkpointProgress =
    milestone.checkpoints.length > 0 ? (completedCheckpoints / milestone.checkpoints.length) * 100 : 0

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "skill":
        return <Target className="w-5 h-5" />
      case "course":
        return <BookOpen className="w-5 h-5" />
      case "project":
        return <Code className="w-5 h-5" />
      case "certification":
        return <Award className="w-5 h-5" />
      default:
        return <Briefcase className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "skill":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "course":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "project":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "certification":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card
      className={`bg-card transition-all duration-300 ${
        milestone.completed
          ? "border-primary/50 bg-primary/5"
          : "border-primary/20 hover:border-primary/40 hover:glow-green"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${getTypeColor(milestone.type)}`}>{getTypeIcon(milestone.type)}</div>
              <div>
                <CardTitle className={`text-lg ${milestone.completed ? "text-primary" : "text-foreground"}`}>
                  {milestone.title}
                  {milestone.completed && <CheckCircle className="w-5 h-5 text-primary inline ml-2" />}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getTypeColor(milestone.type)}>
                    {milestone.type}
                  </Badge>
                  <Badge variant="outline" className={getDifficultyColor(milestone.difficulty)}>
                    {milestone.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <CardDescription className="text-base">{milestone.description}</CardDescription>
          </div>

          <div className="text-right space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {milestone.estimatedWeeks} weeks
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-primary"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {milestone.checkpoints.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">
                {completedCheckpoints}/{milestone.checkpoints.length}
              </span>
            </div>
            <Progress value={checkpointProgress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0 space-y-6">
              {/* Skills & Technologies */}
              {milestone.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Skills & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {milestone.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkpoints */}
              {milestone.checkpoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Checkpoints</h4>
                  <div className="space-y-3">
                    {milestone.checkpoints.map((checkpoint) => (
                      <div
                        key={checkpoint.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                          checkpoint.completed
                            ? "bg-primary/5 border-primary/30"
                            : "bg-muted/20 border-muted-foreground/20 hover:border-primary/30"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCheckpointComplete(checkpoint.id)}
                          className={`p-1 h-6 w-6 rounded-full ${
                            checkpoint.completed
                              ? "text-primary hover:text-primary"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <CheckCircle className={`w-4 h-4 ${checkpoint.completed ? "fill-current" : ""}`} />
                        </Button>
                        <div className="flex-1">
                          <p className={`text-sm ${checkpoint.completed ? "text-primary" : "text-foreground"}`}>
                            {checkpoint.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{checkpoint.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {milestone.resources.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Resources</h4>
                  <div className="space-y-2">
                    {milestone.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        {resource.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Milestone Button */}
              {!milestone.completed && checkpointProgress === 100 && (
                <Button onClick={onComplete} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Complete Milestone
                </Button>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
