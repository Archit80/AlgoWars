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
  tierColor,
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
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-all"
            style={{ 
              backgroundColor: `${tierColor || '#84CC16'}20`,
              borderColor: tierColor || '#84CC16',
              color: tierColor || '#84CC16'
            }}
          >
            <TierIcon className="w-5 h-5" />
          </div>
          
          {/* Level and Tier Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Level {safeLevel}</span>
              {isAtMilestone && (
                <Crown className="w-5 h-5 text-yellow-400" />
              )}
            </div>
            {tierName && (
              <span 
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: tierColor || '#84CC16' }}
              >
                {tierName}
              </span>
            )}
          </div>
        </div>
        
        {/* XP Badge */}
        <Badge className="text-sm">
          {displayCurrentLevelXP.toLocaleString()} / {displayXPRequired.toLocaleString()} XP
        </Badge>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2 z-2">
        <Progress 
          value={Math.min(displayProgress, 100)} 
          className="h-4 bg-neutral-800 z-10" 
          barClassName="bg-gradient-to-r from-lime-400 to-lime-500 transition-all duration-300"
        />
        
        {/* Progress Info */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-lime-400 font-semibold">
            {Math.round(displayProgress)}% Complete
          </span>
          <span className="text-muted-foreground">
            {displayXPToNext.toLocaleString()} XP to next level
          </span>
        </div>
        
        {/* Milestone Indicator */}
        {isAtMilestone && (
          <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium">
              Milestone Level! You earned bonus XP for reaching level {safeLevel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
