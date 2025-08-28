import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Course } from "@/app/courses/page"
import type { RoadmapMilestone } from "@/app/roadmap/page"

// Course Management
export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    if (!db) return []

    try {
      const coursesRef = collection(db, "courses")
      const snapshot = await getDocs(coursesRef)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Course)
    } catch (error) {
      console.error("Error fetching courses:", error)
      return []
    }
  },

  // Get course by ID
  async getCourse(courseId: string): Promise<Course | null> {
    if (!db) return null

    try {
      const courseRef = doc(db, "courses", courseId)
      const snapshot = await getDoc(courseRef)
      return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Course) : null
    } catch (error) {
      console.error("Error fetching course:", error)
      return null
    }
  },

  // Add new course
  async addCourse(course: Omit<Course, "id">): Promise<string | null> {
    if (!db) return null

    try {
      const coursesRef = collection(db, "courses")
      const docRef = await addDoc(coursesRef, {
        ...course,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error adding course:", error)
      return null
    }
  },

  // Update course
  async updateCourse(courseId: string, updates: Partial<Course>): Promise<boolean> {
    if (!db) return false

    try {
      const courseRef = doc(db, "courses", courseId)
      await updateDoc(courseRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })
      return true
    } catch (error) {
      console.error("Error updating course:", error)
      return false
    }
  },
}

// Quiz Results Management
export const quizService = {
  // Save quiz results
  async saveQuizResults(userId: string, results: any): Promise<string | null> {
    if (!db) return null

    try {
      const quizResultsRef = collection(db, "quizResults")
      const docRef = await addDoc(quizResultsRef, {
        userId,
        results,
        completedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error saving quiz results:", error)
      return null
    }
  },

  // Get user's quiz results
  async getUserQuizResults(userId: string): Promise<any[]> {
    if (!db) return []

    try {
      const quizResultsRef = collection(db, "quizResults")
      const q = query(quizResultsRef, where("userId", "==", userId), orderBy("completedAt", "desc"))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching quiz results:", error)
      return []
    }
  },

  // Get latest quiz result for user
  async getLatestQuizResult(userId: string): Promise<any | null> {
    if (!db) return null

    try {
      const quizResultsRef = collection(db, "quizResults")
      const q = query(quizResultsRef, where("userId", "==", userId), orderBy("completedAt", "desc"), limit(1))
      const snapshot = await getDocs(q)
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
    } catch (error) {
      console.error("Error fetching latest quiz result:", error)
      return null
    }
  },
}

// Course Enrollment Management
export const enrollmentService = {
  // Enroll user in course
  async enrollInCourse(userId: string, courseId: string): Promise<boolean> {
    if (!db) return false

    try {
      const enrollmentRef = doc(db, "courseEnrollments", `${userId}_${courseId}`)
      await setDoc(enrollmentRef, {
        userId,
        courseId,
        enrolledAt: serverTimestamp(),
        progress: 0,
        completed: false,
        lastAccessedAt: serverTimestamp(),
      })
      return true
    } catch (error) {
      console.error("Error enrolling in course:", error)
      return false
    }
  },

  // Get user's enrolled courses
  async getUserEnrollments(userId: string): Promise<any[]> {
    if (!db) return []

    try {
      const enrollmentsRef = collection(db, "courseEnrollments")
      const q = query(enrollmentsRef, where("userId", "==", userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching enrollments:", error)
      return []
    }
  },

  // Update course progress
  async updateProgress(userId: string, courseId: string, progress: number): Promise<boolean> {
    if (!db) return false

    try {
      const enrollmentRef = doc(db, "courseEnrollments", `${userId}_${courseId}`)
      await updateDoc(enrollmentRef, {
        progress,
        lastAccessedAt: serverTimestamp(),
        completed: progress >= 100,
      })
      return true
    } catch (error) {
      console.error("Error updating progress:", error)
      return false
    }
  },
}

// User Progress Tracking
export const progressService = {
  // Track skill development
  async trackSkillProgress(userId: string, skill: string, level: number): Promise<boolean> {
    if (!db) return false

    try {
      const progressRef = doc(db, "userProgress", `${userId}_${skill}`)
      await setDoc(
        progressRef,
        {
          userId,
          skill,
          level,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
      return true
    } catch (error) {
      console.error("Error tracking skill progress:", error)
      return false
    }
  },

  // Get user's skill progress
  async getUserSkillProgress(userId: string): Promise<any[]> {
    if (!db) return []

    try {
      const progressRef = collection(db, "userProgress")
      const q = query(progressRef, where("userId", "==", userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching skill progress:", error)
      return []
    }
  },

  // Track milestone completion
  async completeMilestone(userId: string, milestoneId: string, milestone: RoadmapMilestone): Promise<boolean> {
    if (!db) return false

    try {
      const milestoneRef = doc(db, "milestoneCompletions", `${userId}_${milestoneId}`)
      await setDoc(milestoneRef, {
        userId,
        milestoneId,
        milestone,
        completedAt: serverTimestamp(),
      })
      return true
    } catch (error) {
      console.error("Error completing milestone:", error)
      return false
    }
  },
}

// Roadmap Templates Management
export const roadmapService = {
  // Save roadmap template
  async saveRoadmapTemplate(name: string, description: string, milestones: RoadmapMilestone[]): Promise<string | null> {
    if (!db) return null

    try {
      const templatesRef = collection(db, "roadmapTemplates")
      const docRef = await addDoc(templatesRef, {
        name,
        description,
        milestones,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error saving roadmap template:", error)
      return null
    }
  },

  // Get all roadmap templates
  async getRoadmapTemplates(): Promise<any[]> {
    if (!db) return []

    try {
      const templatesRef = collection(db, "roadmapTemplates")
      const snapshot = await getDocs(templatesRef)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error("Error fetching roadmap templates:", error)
      return []
    }
  },
}
