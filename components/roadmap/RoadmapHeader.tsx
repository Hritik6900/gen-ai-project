"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Route, Target, Clock, TrendingUp } from "lucide-react"

interface RoadmapHeaderProps {
  totalMilestones: number
  completedMilestones: number
  totalWeeks: number
  userSkills: string[]
}

export function RoadmapHeader({ totalMilestones, completedMilestones, totalWeeks, userSkills }: RoadmapHeaderProps) {
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-primary glow-green">Your Personalized Journey</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A tailored learning path designed specifically for your skills and career goals. Follow this roadmap to
          advance your expertise and achieve your professional objectives.
        </p>
      </div>

      {/* Overview Card */}
      <Card className="bg-card border-primary/20 glow-green">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
            </div>

            {/* Milestones */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {completedMilestones}/{totalMilestones}
                </div>
                <div className="text-sm text-muted-foreground">Milestones</div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalWeeks}</div>
                <div className="text-sm text-muted-foreground">Weeks Total</div>
              </div>
            </div>

            {/* Skills */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Route className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{userSkills.length}</div>
                <div className="text-sm text-muted-foreground">Current Skills</div>
              </div>
            </div>
          </div>

          {/* Current Skills */}
          {userSkills.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Your Current Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {userSkills.slice(0, 10).map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-primary/20 text-primary border border-primary/30"
                  >
                    {skill}
                  </Badge>
                ))}
                {userSkills.length > 10 && (
                  <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                    +{userSkills.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
