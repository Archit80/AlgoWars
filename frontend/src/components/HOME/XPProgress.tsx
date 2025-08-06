import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

interface XPProgressProps {
  currentXP: number
  totalXP: number
  level: number
  className?: string
}

export function XPProgress({ currentXP, totalXP, level, className }: XPProgressProps) {
  const percentage = (currentXP / totalXP) * 100

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-white">
          <Zap className="w-5 h-5 text-lime-500" />
          <span className="text-lg font-semibold">Level {level}</span>
        </div>
        <Badge variant="electric">
          {currentXP.toLocaleString()} / {totalXP.toLocaleString()} XP
        </Badge>
      </div>
      <Progress value={percentage} className="h-3" barClassName="bg-[#84CC16]" />
      <p className="text-muted-foreground text-sm mt-2">
        {(totalXP - currentXP).toLocaleString()} XP to next level
      </p>
    </div>
  )
}