"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface CourseSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CourseSearch({ searchQuery, onSearchChange }: CourseSearchProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        placeholder="Search courses, skills, or categories..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-12 h-12 bg-input border-border focus:border-primary text-lg"
      />
    </div>
  )
}
