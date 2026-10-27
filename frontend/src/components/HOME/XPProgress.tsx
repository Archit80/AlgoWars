import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap, Crown, Star, Shield, Sword, Trophy, Diamond, Flame } from "lucide-react"

interface XPProgressProps {
  // Basic level info
  level: number
  currentXP: number
  // Enhanced level system props
  currentLevelXP?: number
  xpToNext?: number
  xpRequiredForCurrentLevel?: number
  progress?: number // 0-100 percentage
  // Tier information
  tierName?: string
  tierColor?: string
  tierEmoji?: string
  isAtMilestone?: boolean
  // Legacy compatibility
  totalXP?: number
  className?: string
}

export function XPProgress({ 
  level, 
  currentXP, 
  currentLevelXP, 
  xpToNext, 
  xpRequiredForCurrentLevel,
  progress,
  tierName,

  isAtMilestone,
  totalXP, // legacy
  className 
}: XPProgressProps) {
  // Ensure level is a valid number
  const safeLevel = Math.max(1, level ?? 1)
  
  // Get tier-specific icon
  const getTierIcon = () => {
    switch (tierName?.toUpperCase()) {
      case 'BEGINNER': return Shield
      case 'INTERMEDIATE': return Zap
      case 'ADVANCED': return Sword
      case 'EXPERT': return Diamond
      case 'MASTER': return Flame
      case 'LEGEND': return Trophy
      default: return Zap
    }
  }
  
  const TierIcon = getTierIcon()

  // Use new system if available, fallback to legacy
  const displayProgress = progress ?? ((currentLevelXP && xpRequiredForCurrentLevel) 
    ? (currentLevelXP / xpRequiredForCurrentLevel) * 100 
    : totalXP ? (currentXP / totalXP) * 100 : 0)
  
  // Ensure all display values are valid numbers to prevent toLocaleString errors
  const displayXPToNext = Math.max(0, xpToNext || (totalXP ? totalXP - currentXP : 0) || 0)
  const displayCurrentLevelXP = Math.max(0, currentLevelXP || currentXP || 0)
  const displayXPRequired = Math.max(1, xpRequiredForCurrentLevel || (totalXP ? totalXP : 100) || 100)

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Tier Icon */}
          <div className="w-10 h-10 rounded-md flex items-center justify-center border border-blue-100 bg-blue-50 text-blue-700">
            <TierIcon className="w-5 h-5" />
          </div>

          {/* Level and Tier Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-slate-900">Level {safeLevel}</span>
              {isAtMilestone && (
                <Crown className="w-5 h-5 text-amber-600" />
              )}
            </div>
            {tierName && (
              <span className="section-label">
                {tierName}
              </span>
            )}
          </div>
        </div>

        {/* XP Badge */}
        <Badge variant="outline" className="text-sm border-slate-200 bg-white text-slate-700">
          {displayCurrentLevelXP.toLocaleString()} / {displayXPRequired.toLocaleString()} XP
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress
          value={Math.min(displayProgress, 100)}
          className="h-3 bg-slate-200"
          barClassName="bg-blue-700 transition-all duration-300"
        />

        {/* Progress Info */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-blue-700 font-semibold">
            {Math.round(displayProgress)}% Complete
          </span>
          <span className="text-slate-500">
            {displayXPToNext.toLocaleString()} XP to next level
          </span>
        </div>

        {/* Milestone Indicator */}
        {isAtMilestone && (
          <div className="flex items-center gap-2 mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <Star className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">
              Milestone Level! You earned bonus XP for reaching level {safeLevel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
