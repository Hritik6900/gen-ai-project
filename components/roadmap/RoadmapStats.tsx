"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Target, TrendingUp } from "lucide-react"

interface RoadmapStatsProps {
  totalWeeks: number
  completedWeeks: number
  completedMilestones: number
  totalMilestones: number
}

export function RoadmapStats({ totalWeeks, completedWeeks, completedMilestones, totalMilestones }: RoadmapStatsProps) {
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0
  const timeProgressPercentage = totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0
  const remainingWeeks = totalWeeks - completedWeeks
  const estimatedCompletionDate = new Date()
  estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + remainingWeeks * 7)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {/* Overall Progress */}
      <Card className="bg-card border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {completedMilestones} of {totalMilestones} milestones completed
          </div>
        </CardContent>
      </Card>

      {/* Time Progress */}
      <Card className="bg-card border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-400" />
            Time Investment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold text-foreground">{completedWeeks}w</div>
          <Progress value={timeProgressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">{remainingWeeks} weeks remaining</div>
        </CardContent>
      </Card>

      {/* Completion Estimate */}
      <Card className="bg-card border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-green-400" />
            Est. Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-lg font-bold text-foreground">
            {estimatedCompletionDate.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-muted-foreground">Based on current pace</div>
        </CardContent>
      </Card>

      {/* Next Milestone */}
      <Card className="bg-card border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-orange-400" />
            Next Milestone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm font-medium text-foreground line-clamp-2">
            {completedMilestones < totalMilestones ? "Continue Learning" : "All Complete!"}
          </div>
          <div className="text-xs text-muted-foreground">
            {completedMilestones < totalMilestones
              ? `${totalMilestones - completedMilestones} milestones left`
              : "Congratulations!"}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
