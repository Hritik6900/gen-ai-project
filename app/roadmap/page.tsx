"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline"
import { RoadmapHeader } from "@/components/roadmap/RoadmapHeader"
import { RoadmapStats } from "@/components/roadmap/RoadmapStats"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export interface RoadmapMilestone {
  id: string
  title: string
  description: string
  type: "skill" | "course" | "project" | "certification"
  estimatedWeeks: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  prerequisites: string[]
  skills: string[]
  resources: {
    type: "course" | "article" | "video" | "practice"
    title: string
    url?: string
    duration?: string
  }[]
  completed: boolean
  completedAt?: Date
  checkpoints: {
    id: string
    title: string
    completed: boolean
  }[]
}

const generatePersonalizedRoadmap = (userSkills: string[], quizResults: any): RoadmapMilestone[] => {
  const hasWebDev = userSkills.some((skill) =>
    ["JavaScript", "React", "HTML", "CSS", "Node.js", "Vue.js", "Angular", "Next.js"].includes(skill),
  )
  const hasDataSkills = userSkills.some((skill) =>
    ["Python", "SQL", "Data Analysis", "Machine Learning", "R"].includes(skill),
  )
  const hasDesignSkills = userSkills.some((skill) => ["UI/UX Design", "Figma", "Adobe", "Design"].includes(skill))
  const hasBackendSkills = userSkills.some((skill) =>
    ["Node.js", "Python", "Java", "C++", "Go", "Rust", "Express.js"].includes(skill),
  )

  let roadmap: RoadmapMilestone[] = []

  if (hasWebDev && hasDesignSkills) {
    // Full-Stack Designer Path
    roadmap = [
      {
        id: "1",
        title: "Advanced React Patterns",
        description:
          "Master advanced React concepts including custom hooks, context patterns, and performance optimization.",
        type: "skill",
        estimatedWeeks: 4,
        difficulty: "Intermediate",
        prerequisites: ["React", "JavaScript"],
        skills: ["React", "TypeScript", "Performance Optimization"],
        resources: [
          { type: "course", title: "Advanced React Development", duration: "6 hours" },
          { type: "practice", title: "Build a Complex React App", duration: "2 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "1-1", title: "Learn Custom Hooks", completed: false },
          { id: "1-2", title: "Implement Context API", completed: false },
          { id: "1-3", title: "Optimize Performance", completed: false },
        ],
      },
      {
        id: "2",
        title: "Design System Creation",
        description: "Build a comprehensive design system with reusable components and design tokens.",
        type: "project",
        estimatedWeeks: 6,
        difficulty: "Intermediate",
        prerequisites: ["UI/UX Design", "React"],
        skills: ["Design Systems", "Component Libraries", "Figma"],
        resources: [
          { type: "course", title: "Design Systems Fundamentals", duration: "4 hours" },
          { type: "article", title: "Building Scalable Design Systems" },
          { type: "practice", title: "Create Your Design System", duration: "4 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "2-1", title: "Define Design Tokens", completed: false },
          { id: "2-2", title: "Build Component Library", completed: false },
          { id: "2-3", title: "Document Guidelines", completed: false },
        ],
      },
      {
        id: "3",
        title: "Full-Stack Application",
        description: "Build a complete web application with modern frontend and backend technologies.",
        type: "project",
        estimatedWeeks: 8,
        difficulty: "Advanced",
        prerequisites: ["React", "Node.js", "Database"],
        skills: ["Full-Stack Development", "API Design", "Database Design"],
        resources: [
          { type: "course", title: "Full-Stack Web Development", duration: "12 hours" },
          { type: "practice", title: "Build Portfolio Project", duration: "6 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "3-1", title: "Setup Backend API", completed: false },
          { id: "3-2", title: "Implement Authentication", completed: false },
          { id: "3-3", title: "Deploy to Production", completed: false },
        ],
      },
    ]
  } else if (hasDataSkills) {
    // Data Science Path
    roadmap = [
      {
        id: "1",
        title: "Advanced Python for Data Science",
        description: "Master advanced Python libraries and techniques for data manipulation and analysis.",
        type: "skill",
        estimatedWeeks: 5,
        difficulty: "Intermediate",
        prerequisites: ["Python", "Basic Data Analysis"],
        skills: ["Pandas", "NumPy", "Data Visualization"],
        resources: [
          { type: "course", title: "Advanced Python Data Science", duration: "8 hours" },
          { type: "practice", title: "Data Analysis Projects", duration: "3 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "1-1", title: "Master Pandas Operations", completed: false },
          { id: "1-2", title: "Advanced Visualization", completed: false },
          { id: "1-3", title: "Statistical Analysis", completed: false },
        ],
      },
      {
        id: "2",
        title: "Machine Learning Fundamentals",
        description: "Learn core ML algorithms and implement them from scratch and with libraries.",
        type: "course",
        estimatedWeeks: 8,
        difficulty: "Intermediate",
        prerequisites: ["Python", "Statistics"],
        skills: ["Machine Learning", "Scikit-learn", "Model Evaluation"],
        resources: [
          { type: "course", title: "Machine Learning Bootcamp", duration: "15 hours" },
          { type: "practice", title: "ML Project Portfolio", duration: "5 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "2-1", title: "Supervised Learning", completed: false },
          { id: "2-2", title: "Unsupervised Learning", completed: false },
          { id: "2-3", title: "Model Deployment", completed: false },
        ],
      },
      {
        id: "3",
        title: "Data Science Capstone Project",
        description: "Complete an end-to-end data science project from data collection to deployment.",
        type: "project",
        estimatedWeeks: 10,
        difficulty: "Advanced",
        prerequisites: ["Machine Learning", "Data Analysis"],
        skills: ["End-to-End ML", "Data Pipeline", "Model Deployment"],
        resources: [
          { type: "practice", title: "Capstone Project", duration: "8 weeks" },
          { type: "article", title: "ML Project Best Practices" },
        ],
        completed: false,
        checkpoints: [
          { id: "3-1", title: "Data Collection & Cleaning", completed: false },
          { id: "3-2", title: "Model Development", completed: false },
          { id: "3-3", title: "Production Deployment", completed: false },
        ],
      },
    ]
  } else if (hasWebDev) {
    // Frontend Developer Path
    roadmap = [
      {
        id: "1",
        title: "Modern JavaScript Mastery",
        description: "Deep dive into ES6+, async programming, and modern JavaScript patterns.",
        type: "skill",
        estimatedWeeks: 4,
        difficulty: "Intermediate",
        prerequisites: ["JavaScript Basics"],
        skills: ["ES6+", "Async/Await", "Modern JS Patterns"],
        resources: [
          { type: "course", title: "Modern JavaScript Complete Guide", duration: "10 hours" },
          { type: "practice", title: "JavaScript Challenges", duration: "2 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "1-1", title: "ES6+ Features", completed: false },
          { id: "1-2", title: "Async Programming", completed: false },
          { id: "1-3", title: "Module Systems", completed: false },
        ],
      },
      {
        id: "2",
        title: "React Ecosystem Mastery",
        description: "Master React Router, state management, testing, and the broader React ecosystem.",
        type: "skill",
        estimatedWeeks: 6,
        difficulty: "Intermediate",
        prerequisites: ["React", "JavaScript"],
        skills: ["React Router", "Redux", "React Testing"],
        resources: [
          { type: "course", title: "Complete React Developer", duration: "12 hours" },
          { type: "practice", title: "React Projects", duration: "4 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "2-1", title: "React Router Setup", completed: false },
          { id: "2-2", title: "State Management", completed: false },
          { id: "2-3", title: "Testing Implementation", completed: false },
        ],
      },
      {
        id: "3",
        title: "Frontend Portfolio Project",
        description: "Build a comprehensive portfolio showcasing your frontend development skills.",
        type: "project",
        estimatedWeeks: 8,
        difficulty: "Advanced",
        prerequisites: ["React", "Modern JavaScript"],
        skills: ["Portfolio Development", "Performance Optimization", "Deployment"],
        resources: [
          { type: "practice", title: "Portfolio Website", duration: "6 weeks" },
          { type: "article", title: "Frontend Best Practices" },
        ],
        completed: false,
        checkpoints: [
          { id: "3-1", title: "Design & Planning", completed: false },
          { id: "3-2", title: "Development & Testing", completed: false },
          { id: "3-3", title: "Deployment & Optimization", completed: false },
        ],
      },
    ]
  } else {
    // General Tech Path
    roadmap = [
      {
        id: "1",
        title: "Programming Fundamentals",
        description: "Build a strong foundation in programming concepts and problem-solving.",
        type: "skill",
        estimatedWeeks: 6,
        difficulty: "Beginner",
        prerequisites: [],
        skills: ["Programming Logic", "Problem Solving", "Algorithms"],
        resources: [
          { type: "course", title: "Programming Fundamentals", duration: "8 hours" },
          { type: "practice", title: "Coding Challenges", duration: "4 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "1-1", title: "Basic Syntax", completed: false },
          { id: "1-2", title: "Control Structures", completed: false },
          { id: "1-3", title: "Problem Solving", completed: false },
        ],
      },
      {
        id: "2",
        title: "Web Development Basics",
        description: "Learn HTML, CSS, and JavaScript to build your first web applications.",
        type: "course",
        estimatedWeeks: 8,
        difficulty: "Beginner",
        prerequisites: ["Programming Fundamentals"],
        skills: ["HTML", "CSS", "JavaScript"],
        resources: [
          { type: "course", title: "Web Development Bootcamp", duration: "15 hours" },
          { type: "practice", title: "Build 5 Projects", duration: "6 weeks" },
        ],
        completed: false,
        checkpoints: [
          { id: "2-1", title: "HTML Structure", completed: false },
          { id: "2-2", title: "CSS Styling", completed: false },
          { id: "2-3", title: "JavaScript Interactivity", completed: false },
        ],
      },
      {
        id: "3",
        title: "First Web Application",
        description: "Build your first complete web application with modern tools and practices.",
        type: "project",
        estimatedWeeks: 10,
        difficulty: "Intermediate",
        prerequisites: ["HTML", "CSS", "JavaScript"],
        skills: ["Web Development", "Project Management", "Version Control"],
        resources: [
          { type: "practice", title: "Web App Project", duration: "8 weeks" },
          { type: "course", title: "Git & GitHub", duration: "3 hours" },
        ],
        completed: false,
        checkpoints: [
          { id: "3-1", title: "Project Planning", completed: false },
          { id: "3-2", title: "Development", completed: false },
          { id: "3-3", title: "Testing & Deployment", completed: false },
        ],
      },
    ]
  }

  // Add certification milestone
  roadmap.push({
    id: "cert",
    title: "Professional Certification",
    description: "Earn a recognized certification to validate your skills and boost your career prospects.",
    type: "certification",
    estimatedWeeks: 2,
    difficulty: "Advanced",
    prerequisites: roadmap.map((m) => m.title),
    skills: ["Certification", "Professional Validation"],
    resources: [
      { type: "course", title: "Certification Prep", duration: "4 hours" },
      { type: "practice", title: "Mock Exams", duration: "1 week" },
    ],
    completed: false,
    checkpoints: [
      { id: "cert-1", title: "Study Materials", completed: false },
      { id: "cert-2", title: "Practice Exams", completed: false },
      { id: "cert-3", title: "Take Certification", completed: false },
    ],
  })

  return roadmap
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>([])
  const [loading, setLoading] = useState(true)
  const { userProfile, updateUserProfile } = useAuth()

  useEffect(() => {
    if (userProfile) {
      // Check if user already has a roadmap
      if (userProfile.roadmap) {
        setRoadmap(userProfile.roadmap)
      } else {
        // Generate new roadmap based on skills and quiz results
        const generatedRoadmap = generatePersonalizedRoadmap(userProfile.skills || [], userProfile.quizResults)
        setRoadmap(generatedRoadmap)
        // Save to user profile
        updateUserProfile({ roadmap: generatedRoadmap })
      }
      setLoading(false)
    }
  }, [userProfile, updateUserProfile])

  const handleMilestoneComplete = async (milestoneId: string) => {
    const updatedRoadmap = roadmap.map((milestone) =>
      milestone.id === milestoneId ? { ...milestone, completed: true, completedAt: new Date() } : milestone,
    )
    setRoadmap(updatedRoadmap)
    await updateUserProfile({ roadmap: updatedRoadmap })
  }

  const handleCheckpointComplete = async (milestoneId: string, checkpointId: string) => {
    const updatedRoadmap = roadmap.map((milestone) =>
      milestone.id === milestoneId
        ? {
            ...milestone,
            checkpoints: milestone.checkpoints.map((checkpoint) =>
              checkpoint.id === checkpointId ? { ...checkpoint, completed: true } : checkpoint,
            ),
          }
        : milestone,
    )
    setRoadmap(updatedRoadmap)
    await updateUserProfile({ roadmap: updatedRoadmap })
  }

  const completedMilestones = roadmap.filter((m) => m.completed).length
  const totalWeeks = roadmap.reduce((sum, m) => sum + m.estimatedWeeks, 0)
  const completedWeeks = roadmap.filter((m) => m.completed).reduce((sum, m) => sum + m.estimatedWeeks, 0)

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 bg-card border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-foreground">Generating your personalized roadmap...</span>
            </div>
          </Card>
        </div>
      </ProtectedRoute>
    )
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
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold text-primary glow-green">Your Learning Roadmap</h1>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Roadmap Header */}
          <RoadmapHeader
            totalMilestones={roadmap.length}
            completedMilestones={completedMilestones}
            totalWeeks={totalWeeks}
            userSkills={userProfile?.skills || []}
          />

          {/* Stats */}
          <RoadmapStats
            totalWeeks={totalWeeks}
            completedWeeks={completedWeeks}
            completedMilestones={completedMilestones}
            totalMilestones={roadmap.length}
          />

          {/* Timeline */}
          <RoadmapTimeline
            milestones={roadmap}
            onMilestoneComplete={handleMilestoneComplete}
            onCheckpointComplete={handleCheckpointComplete}
          />
        </main>
      </div>
    </ProtectedRoute>
  )
}
