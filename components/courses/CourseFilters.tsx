"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"

interface CourseFiltersProps {
  categories: string[]
  levels: string[]
  selectedCategory: string
  selectedLevel: string
  onCategoryChange: (category: string) => void
  onLevelChange: (level: string) => void
}

export function CourseFilters({
  categories,
  levels,
  selectedCategory,
  selectedLevel,
  onCategoryChange,
  onLevelChange,
}: CourseFiltersProps) {
  return (
    <Card className="bg-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5 text-primary" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Category</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Level</h4>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <Badge
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedLevel === level
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
                onClick={() => onLevelChange(level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
