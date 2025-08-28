"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Star, TrendingUp, BookOpen } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { enrollmentService } from "@/lib/firestore"
import type { Course } from "@/app/courses/page"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const { user } = useAuth()

  const handleEnroll = async () => {
    if (!user) return

    setIsEnrolling(true)
    try {
      const success = await enrollmentService.enrollInCourse(user.uid, course.id)
      if (success) {
        setIsEnrolled(true)
        console.log(`Successfully enrolled in course: ${course.title}`)
      }
    } catch (error) {
      console.error("Enrollment failed:", error)
    } finally {
      setIsEnrolling(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
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
    <motion.div whileHover={{ y: -5 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
      <Card
        className={`h-full bg-card border-primary/20 transition-all duration-300 ${
          isHovered ? "border-primary/50 glow-green" : ""
        }`}
      >
        {/* Course Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              {course.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/20 text-primary border border-primary/30 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <Badge variant="outline" className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-primary line-clamp-2 mb-1">{course.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{course.category}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">${course.price}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>

          {/* Benefit */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground font-medium">{course.benefit}</p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{course.hoursPerWeek}h/week</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-muted-foreground">
                {course.rating} ({course.studentsEnrolled.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{course.studentsEnrolled.toLocaleString()} students</span>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Skills you'll learn:</h4>
            <div className="flex flex-wrap gap-1">
              {course.skills.slice(0, 4).map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-xs border-muted-foreground/30 text-muted-foreground"
                >
                  {skill}
                </Badge>
              ))}
              {course.skills.length > 4 && (
                <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                  +{course.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Instructor */}
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Instructor:</span> {course.instructor}
          </div>

          {/* Enroll Button */}
          <Button
            onClick={handleEnroll}
            disabled={isEnrolled || isEnrolling}
            className={`w-full ${isEnrolled ? "" : "glow-green"}`}
            variant={isEnrolled ? "secondary" : "default"}
          >
            {isEnrolling ? "Enrolling..." : isEnrolled ? "Enrolled" : "Enroll Now"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
