"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, googleProvider, db } from "@/lib/firebase"

interface UserProfile {
  uid: string
  email: string
  displayName: string
  skills: string[]
  quizResults?: any
  roadmap?: any
  courses?: any[]
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const isFirebaseAvailable = auth && db && googleProvider

  // Create user profile in Firestore
  const createUserProfile = async (user: User, additionalData: any = {}) => {
    if (!db) return

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const { displayName, email } = user
      const createdAt = new Date()

      const profileData: UserProfile = {
        uid: user.uid,
        email: email || "",
        displayName: displayName || "",
        skills: [],
        createdAt,
        ...additionalData,
      }

      await setDoc(userRef, profileData)
      setUserProfile(profileData)
    } else {
      setUserProfile(userSnap.data() as UserProfile)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error("Firebase not configured")

    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })
    await createUserProfile(user, { displayName })
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured")

    await signInWithEmailAndPassword(auth, email, password)
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error("Firebase not configured")

    const { user } = await signInWithPopup(auth, googleProvider)
    await createUserProfile(user)
  }

  // Logout
  const logout = async () => {
    if (!auth) return

    await signOut(auth)
    setUserProfile(null)
  }

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !db) return

    const userRef = doc(db, "users", user.uid)
    await setDoc(userRef, data, { merge: true })

    // Update local state
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null))
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        if (db) {
          const userRef = doc(db, "users", user.uid)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile)
          } else {
            await createUserProfile(user)
          }
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
