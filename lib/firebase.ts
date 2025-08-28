import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isConfigValid = Object.values(firebaseConfig).every((value) => value && value !== "undefined")

let app: any = null
let auth: any = null
let db: any = null
let googleProvider: any = null

if (isConfigValid) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig)

    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app)

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app)

    // Google Auth Provider
    googleProvider = new GoogleAuthProvider()
  } catch (error) {
    console.warn("Firebase initialization failed:", error)
  }
} else {
  console.warn("Firebase configuration is incomplete. Please set up environment variables.")
}

export { auth, db, googleProvider }
export default app
