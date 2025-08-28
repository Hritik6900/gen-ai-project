"use client"

import { motion } from "framer-motion"
import type { RoadmapMilestone } from "@/app/roadmap/page"
import { MilestoneCard } from "./MilestoneCard"

interface RoadmapTimelineProps {
  milestones: RoadmapMilestone[]
  onMilestoneComplete: (milestoneId: string) => void
  onCheckpointComplete: (milestoneId: string, checkpointId: string) => void
}

export function RoadmapTimeline({ milestones, onMilestoneComplete, onCheckpointComplete }: RoadmapTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-bold text-foreground">Learning Timeline</h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 glow-green" />

        {/* Milestones */}
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div
                className={`absolute left-6 w-4 h-4 rounded-full border-2 ${
                  milestone.completed ? "bg-primary border-primary glow-green" : "bg-background border-primary/50"
                } z-10`}
              />

              {/* Milestone Card */}
              <div className="ml-16">
                <MilestoneCard
                  milestone={milestone}
                  onComplete={() => onMilestoneComplete(milestone.id)}
                  onCheckpointComplete={(checkpointId) => onCheckpointComplete(milestone.id, checkpointId)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
