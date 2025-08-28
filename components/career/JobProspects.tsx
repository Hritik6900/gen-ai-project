"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

interface JobProspectsProps {
  skills: string[]
  quizResults: any
}

interface JobRole {
  title: string
  description: string
  salaryRange: string
  growthRate: string
  demandLevel: "High" | "Medium" | "Low"
  requiredSkills: string[]
  matchPercentage: number
}

const generateJobRoles = (skills: string[], quizResults: any): JobRole[] => {
  const hasWebDev = skills.some((skill) =>
    ["JavaScript", "React", "HTML", "CSS", "Node.js", "Vue.js", "Angular", "Next.js"].includes(skill),
  )
  const hasDataSkills = skills.some((skill) =>
    ["Python", "SQL", "Data Analysis", "Machine Learning", "R"].includes(skill),
  )
  const hasDesignSkills = skills.some((skill) => ["UI/UX Design", "Figma", "Adobe", "Design"].includes(skill))
  const hasBackendSkills = skills.some((skill) =>
    ["Node.js", "Python", "Java", "C++", "Go", "Rust", "Express.js"].includes(skill),
  )
  const hasCloudSkills = skills.some((skill) => ["AWS", "Docker", "Kubernetes", "DevOps"].includes(skill))

  const roles: JobRole[] = []

  if (hasWebDev) {
    roles.push({
      title: "Frontend Developer",
      description: "Build user interfaces and web applications using modern frameworks and technologies.",
      salaryRange: "$70k - $120k",
      growthRate: "+22%",
      demandLevel: "High",
      requiredSkills: ["JavaScript", "React", "HTML", "CSS", "TypeScript"],
      matchPercentage: calculateMatch(skills, ["JavaScript", "React", "HTML", "CSS", "TypeScript"]),
    })

    if (hasBackendSkills) {
      roles.push({
        title: "Full-Stack Developer",
        description: "Work on both frontend and backend systems to create complete web applications.",
        salaryRange: "$80k - $140k",
        growthRate: "+25%",
        demandLevel: "High",
        requiredSkills: ["JavaScript", "React", "Node.js", "SQL", "Git"],
        matchPercentage: calculateMatch(skills, ["JavaScript", "React", "Node.js", "SQL", "Git"]),
      })
    }
  }

  if (hasDataSkills) {
    roles.push({
      title: "Data Scientist",
      description: "Analyze complex data to extract insights and build predictive models.",
      salaryRange: "$95k - $165k",
      growthRate: "+31%",
      demandLevel: "High",
      requiredSkills: ["Python", "SQL", "Machine Learning", "Data Analysis"],
      matchPercentage: calculateMatch(skills, ["Python", "SQL", "Machine Learning", "Data Analysis"]),
    })

    roles.push({
      title: "Data Analyst",
      description: "Transform data into actionable insights for business decision-making.",
      salaryRange: "$60k - $95k",
      growthRate: "+28%",
      demandLevel: "High",
      requiredSkills: ["SQL", "Python", "Data Analysis", "Excel"],
      matchPercentage: calculateMatch(skills, ["SQL", "Python", "Data Analysis"]),
    })
  }

  if (hasDesignSkills) {
    roles.push({
      title: "UI/UX Designer",
      description: "Design user experiences and interfaces for web and mobile applications.",
      salaryRange: "$65k - $110k",
      growthRate: "+18%",
      demandLevel: "High",
      requiredSkills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
      matchPercentage: calculateMatch(skills, ["UI/UX Design", "Figma"]),
    })
  }

  if (hasBackendSkills) {
    roles.push({
      title: "Backend Developer",
      description: "Build server-side applications, APIs, and database systems.",
      salaryRange: "$75k - $130k",
      growthRate: "+20%",
      demandLevel: "High",
      requiredSkills: ["Python", "Node.js", "SQL", "API Development"],
      matchPercentage: calculateMatch(skills, ["Python", "Node.js", "SQL"]),
    })
  }

  if (hasCloudSkills) {
    roles.push({
      title: "DevOps Engineer",
      description: "Manage infrastructure, deployment pipelines, and cloud systems.",
      salaryRange: "$90k - $150k",
      growthRate: "+27%",
      demandLevel: "High",
      requiredSkills: ["AWS", "Docker", "Kubernetes", "DevOps", "Git"],
      matchPercentage: calculateMatch(skills, ["AWS", "Docker", "Kubernetes", "DevOps"]),
    })
  }

  // Add some general tech roles
  roles.push({
    title: "Software Engineer",
    description: "Design and develop software solutions across various platforms and technologies.",
    salaryRange: "$80k - $135k",
    growthRate: "+24%",
    demandLevel: "High",
    requiredSkills: ["Programming", "Problem Solving", "Git", "Algorithms"],
    matchPercentage: calculateMatch(skills, ["JavaScript", "Python", "Java", "Git"]),
  })

  roles.push({
    title: "Product Manager",
    description: "Guide product development from conception to launch, working with cross-functional teams.",
    salaryRange: "$100k - $170k",
    growthRate: "+19%",
    demandLevel: "Medium",
    requiredSkills: ["Project Management", "Analytics", "Communication", "Strategy"],
    matchPercentage: calculateMatch(skills, ["Project Management", "Agile"]),
  })

  return roles.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 6)
}

const calculateMatch = (userSkills: string[], requiredSkills: string[]): number => {
  const matches = requiredSkills.filter((skill) =>
    userSkills.some(
      (userSkill) =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill.toLowerCase()),
    ),
  ).length

  return Math.round((matches / requiredSkills.length) * 100)
}

const getDemandColor = (level: string) => {
  switch (level) {
    case "High":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "Low":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export function JobProspects({ skills, quizResults }: JobProspectsProps) {
  const jobRoles = generateJobRoles(skills, quizResults)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-primary mb-4 glow-green">Career Prospects</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Based on your skills and assessment, here are the most promising career opportunities for you.
        </p>
      </div>

      <div className="grid gap-6 max-w-5xl mx-auto">
        {jobRoles.map((role, index) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:glow-green">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-primary">{role.title}</CardTitle>
                    <CardDescription className="text-base">{role.description}</CardDescription>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-2xl font-bold text-primary">{role.matchPercentage}%</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{role.salaryRange}</div>
                      <div className="text-xs text-muted-foreground">Salary Range</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{role.growthRate}</div>
                      <div className="text-xs text-muted-foreground">Growth Rate</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <div>
                      <Badge variant="outline" className={getDemandColor(role.demandLevel)}>
                        {role.demandLevel} Demand
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Key Skills Required:</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.requiredSkills.map((skill) => {
                      const hasSkill = skills.some(
                        (userSkill) =>
                          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                          skill.toLowerCase().includes(userSkill.toLowerCase()),
                      )

                      return (
                        <Badge
                          key={skill}
                          variant={hasSkill ? "default" : "outline"}
                          className={
                            hasSkill
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "border-muted-foreground/30 text-muted-foreground"
                          }
                        >
                          {skill}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Back to Home */}
      <div className="flex justify-center pt-8">
        <Link href="/">
          <Button size="lg" className="glow-green-intense">
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
