"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { CourseGrid } from "@/components/courses/CourseGrid"
import { CourseFilters } from "@/components/courses/CourseFilters"
import { CourseSearch } from "@/components/courses/CourseSearch"
import { courseService } from "@/lib/firestore"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Filter, Search } from "lucide-react"
import Link from "next/link"

export interface Course {
  id: string
  title: string
  description: string
  benefit: string
  hoursPerWeek: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  skills: string[]
  instructor: string
  rating: number
  studentsEnrolled: number
  price: number
  imageUrl?: string
  tags: string[]
}

// Sample course data - in production this would come from Firestore
const SAMPLE_COURSES: Course[] = [
  {
    id: "1",
    title: "Modern React Development",
    description:
      "Master React 18 with hooks, context, and modern patterns. Build scalable applications with best practices.",
    benefit: "Build production-ready React applications and advance your frontend career",
    hoursPerWeek: 8,
    duration: "12 weeks",
    level: "Intermediate",
    category: "Frontend Development",
    skills: ["React", "JavaScript", "TypeScript", "Next.js"],
    instructor: "Sarah Chen",
    rating: 4.8,
    studentsEnrolled: 2847,
    price: 149,
    tags: ["Popular", "Career Boost"],
  },
  {
    id: "2",
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis, visualization, and machine learning applications.",
    benefit: "Transition into high-demand data science roles with practical Python skills",
    hoursPerWeek: 10,
    duration: "16 weeks",
    level: "Beginner",
    category: "Data Science",
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Machine Learning"],
    instructor: "Dr. Michael Rodriguez",
    rating: 4.9,
    studentsEnrolled: 3521,
    price: 199,
    tags: ["Bestseller", "Career Change"],
  },
  {
    id: "3",
    title: "Full-Stack JavaScript",
    description: "Complete web development with Node.js, Express, MongoDB, and React. Build end-to-end applications.",
    benefit: "Become a versatile full-stack developer capable of building complete web applications",
    hoursPerWeek: 12,
    duration: "20 weeks",
    level: "Intermediate",
    category: "Full-Stack Development",
    skills: ["JavaScript", "Node.js", "React", "MongoDB", "Express.js"],
    instructor: "Alex Thompson",
    rating: 4.7,
    studentsEnrolled: 1923,
    price: 249,
    tags: ["Comprehensive", "Project-Based"],
  },
  {
    id: "4",
    title: "UI/UX Design Fundamentals",
    description: "Learn design principles, user research, prototyping, and modern design tools like Figma.",
    benefit: "Create beautiful, user-centered designs and launch your design career",
    hoursPerWeek: 6,
    duration: "10 weeks",
    level: "Beginner",
    category: "Design",
    skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
    instructor: "Emma Wilson",
    rating: 4.6,
    studentsEnrolled: 1456,
    price: 129,
    tags: ["Creative", "Portfolio Building"],
  },
  {
    id: "5",
    title: "Cloud Architecture with AWS",
    description:
      "Master AWS services, serverless architecture, and cloud deployment strategies for scalable applications.",
    benefit: "Become a cloud architect and command higher salaries in the growing cloud market",
    hoursPerWeek: 8,
    duration: "14 weeks",
    level: "Advanced",
    category: "Cloud Computing",
    skills: ["AWS", "Docker", "Kubernetes", "Serverless", "DevOps"],
    instructor: "James Park",
    rating: 4.8,
    studentsEnrolled: 987,
    price: 299,
    tags: ["High Salary", "Enterprise"],
  },
  {
    id: "6",
    title: "Machine Learning Fundamentals",
    description: "Introduction to ML algorithms, supervised and unsupervised learning, and practical implementations.",
    benefit: "Enter the AI field with solid ML foundations and practical project experience",
    hoursPerWeek: 10,
    duration: "18 weeks",
    level: "Intermediate",
    category: "Machine Learning",
    skills: ["Python", "Machine Learning", "TensorFlow", "Scikit-learn"],
    instructor: "Dr. Lisa Zhang",
    rating: 4.9,
    studentsEnrolled: 2134,
    price: 279,
    tags: ["AI/ML", "Future Skills"],
  },
  {
    id: "7",
    title: "Mobile App Development",
    description: "Build native mobile apps for iOS and Android using React Native and modern development practices.",
    benefit: "Develop mobile apps and tap into the growing mobile-first market",
    hoursPerWeek: 9,
    duration: "16 weeks",
    level: "Intermediate",
    category: "Mobile Development",
    skills: ["React Native", "JavaScript", "Mobile UI", "App Store"],
    instructor: "Carlos Martinez",
    rating: 4.5,
    studentsEnrolled: 1678,
    price: 189,
    tags: ["Mobile", "Cross-Platform"],
  },
  {
    id: "8",
    title: "Cybersecurity Essentials",
    description: "Learn security fundamentals, ethical hacking, and how to protect systems from cyber threats.",
    benefit: "Start a lucrative cybersecurity career in one of the fastest-growing tech fields",
    hoursPerWeek: 7,
    duration: "12 weeks",
    level: "Beginner",
    category: "Cybersecurity",
    skills: ["Network Security", "Ethical Hacking", "Risk Assessment", "Compliance"],
    instructor: "Robert Kim",
    rating: 4.7,
    studentsEnrolled: 1234,
    price: 219,
    tags: ["High Demand", "Security"],
  },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedLevel, setSelectedLevel] = useState<string>("All")
  const [showFilters, setShowFilters] = useState(false)
  const { userProfile, user } = useAuth()

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const firestoreCourses = await courseService.getAllCourses()

        if (firestoreCourses.length > 0) {
          setCourses(firestoreCourses)
        } else {
          // Fallback to sample data if no courses in Firestore
          setCourses(SAMPLE_COURSES)

          // Optionally seed Firestore with sample data
          if (user) {
            console.log("Seeding Firestore with sample courses...")
            for (const course of SAMPLE_COURSES) {
              await courseService.addCourse(course)
            }
          }
        }
      } catch (error) {
        console.error("Error loading courses:", error)
        setCourses(SAMPLE_COURSES)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [user])

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
          course.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    // Level filter
    if (selectedLevel !== "All") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    setFilteredCourses(filtered)
  }, [courses, searchQuery, selectedCategory, selectedLevel])

  // Get recommended courses based on user skills
  const getRecommendedCourses = () => {
    if (!userProfile?.skills) return []

    return courses
      .map((course) => ({
        ...course,
        relevanceScore: course.skills.filter((skill) =>
          userProfile.skills.some(
            (userSkill) =>
              userSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(userSkill.toLowerCase()),
          ),
        ).length,
      }))
      .filter((course) => course.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3)
  }

  const recommendedCourses = getRecommendedCourses()
  const categories = ["All", ...Array.from(new Set(courses.map((course) => course.category)))]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 bg-card border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-foreground">Loading courses...</span>
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
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold text-primary glow-green">Courses</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-primary/20 hover:border-primary/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Hero Section */}
          <motion.div className="text-center space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl font-bold text-primary glow-green">Accelerate Your Growth</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our curated selection of courses designed to advance your career and master in-demand skills.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <CourseSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </motion.div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CourseFilters
                categories={categories}
                levels={levels}
                selectedCategory={selectedCategory}
                selectedLevel={selectedLevel}
                onCategoryChange={setSelectedCategory}
                onLevelChange={setSelectedLevel}
              />
            </motion.div>
          )}

          {/* Recommended Courses */}
          {recommendedCourses.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-primary">Recommended for You</h3>
              </div>
              <CourseGrid courses={recommendedCourses} />
            </motion.section>
          )}

          {/* All Courses */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">All Courses ({filteredCourses.length})</h3>
            </div>

            {filteredCourses.length > 0 ? (
              <CourseGrid courses={filteredCourses} />
            ) : (
              <Card className="p-12 text-center bg-card border-primary/20">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No courses found</h4>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find more courses.
                </p>
              </Card>
            )}
          </motion.section>
        </main>
      </div>
    </ProtectedRoute>
  )
}
