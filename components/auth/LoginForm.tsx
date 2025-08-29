// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useAuth } from "@/contexts/AuthContext"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/hooks/use-toast"
// import { Eye, EyeOff, Mail, Lock, Chrome } from "lucide-react"
// import { motion } from "framer-motion"

// interface LoginFormProps {
//   onToggleMode: () => void
//   onClose: () => void
// }

// export function LoginForm({ onToggleMode, onClose }: LoginFormProps) {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const { signIn, signInWithGoogle } = useAuth()
//   const { toast } = useToast()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       await signIn(email, password)
//       toast({
//         title: "Welcome back!",
//         description: "You've successfully signed in.",
//       })
//       onClose()
//     } catch (error: any) {
//       toast({
//         title: "Sign in failed",
//         description: error.message || "Please check your credentials and try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleGoogleSignIn = async () => {
//     setLoading(true)
//     try {
//       await signInWithGoogle()
//       toast({
//         title: "Welcome!",
//         description: "You've successfully signed in with Google.",
//       })
//       onClose()
//     } catch (error: any) {
//       toast({
//         title: "Google sign in failed",
//         description: error.message || "Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
//       <Card className="w-full max-w-md mx-auto bg-card border-primary/20 glow-green">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
//           <CardDescription className="text-muted-foreground">
//             Sign in to access your personalized learning journey
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-foreground">
//                 Email
//               </Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10 bg-input border-border focus:border-primary"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password" className="text-foreground">
//                 Password
//               </Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-10 pr-10 bg-input border-border focus:border-primary"
//                   required
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-muted-foreground" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-muted-foreground" />
//                   )}
//                 </Button>
//               </div>
//             </div>

//             <Button type="submit" className="w-full glow-green" disabled={loading}>
//               {loading ? "Signing in..." : "Sign In"}
//             </Button>
//           </form>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <Separator className="w-full" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
//             </div>
//           </div>

//           <Button
//             type="button"
//             variant="outline"
//             className="w-full border-primary/20 hover:border-primary/50 hover:glow-green bg-transparent"
//             onClick={handleGoogleSignIn}
//             disabled={loading}
//           >
//             <Chrome className="mr-2 h-4 w-4" />
//             Google
//           </Button>

//           <div className="text-center text-sm">
//             <span className="text-muted-foreground">Don't have an account? </span>
//             <Button
//               type="button"
//               variant="link"
//               className="p-0 h-auto text-primary hover:text-primary/80"
//               onClick={onToggleMode}
//             >
//               Sign up
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }
