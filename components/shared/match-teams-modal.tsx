'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import type { Team } from '@/types'
import { TeamCard } from './team-card'

interface MatchTeamsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teams: Team[]
  onMatchRequest: (team: Team) => void
}

export function MatchTeamsModal({ open, onOpenChange, teams, onMatchRequest }: MatchTeamsModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg border-primary/50 bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold text-foreground">AI 추천 팀 ({teams.length}개)</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              ×
            </Button>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">매칭 점수를 기반으로 추천된 팀 목록입니다.</p>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                actionButton={{
                  label: '매칭하기',
                  onClick: () => {
                    onMatchRequest(team)
                    onOpenChange(false)
                  },
                  variant: 'outline'
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
