'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, MessageCircle, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const allTeams = [
  { name: '세종 born_9', date: '5월 11일', time: '오후 6시', location: '광진구 능동로', level: 'A', isOfficial: true, members: 5, maxMembers: 5 },
  { name: '세종 born_10', date: '5월 12일', time: '오후 7시', location: '광진구 능동로', level: 'A+', isOfficial: false, members: 3, maxMembers: 5 },
  { name: '세종 born_11', date: '5월 13일', time: '오후 8시', location: '광진구 능동로', level: 'A-', isOfficial: true, members: 5, maxMembers: 5 },
  { name: '광진 Thunder', date: '5월 14일', time: '오후 5시', location: '광진구 자양동', level: 'B+', isOfficial: true, members: 5, maxMembers: 5 },
  { name: '능동 Warriors', date: '5월 15일', time: '오후 6시 30분', location: '광진구 능동로', level: 'A', isOfficial: false, members: 4, maxMembers: 5 },
]

export default function AllTeamsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">내 근처 팀</h1>
            <p className="text-sm text-muted-foreground">{allTeams.length}개 팀</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg p-4">
        <div className="space-y-3">
          {allTeams.map((team, index) => (
            <Card key={index} className="border-border/50 bg-card">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#181B1F]">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-foreground">{team.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          레벨 {team.level}
                        </Badge>
                        {team.isOfficial ? (
                          <Badge className="bg-primary/10 text-xs text-primary">
                            정식 팀
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            모집 중 {team.members}/{team.maxMembers}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 space-y-1 rounded-lg bg-secondary/30 p-3 text-sm">
                  <p className="text-foreground">
                    <span className="text-muted-foreground">일정:</span> {team.date} {team.time}
                  </p>
                  <p className="text-foreground">
                    <span className="text-muted-foreground">장소:</span> {team.location}
                  </p>
                </div>

                {team.isOfficial ? (
                  <Button className="w-full font-semibold">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    매칭하기
                  </Button>
                ) : (
                  <Button className="w-full font-semibold bg-[#181B1F] hover:bg-[#181B1F]/90 text-white">
                    <UserPlus className="mr-2 h-4 w-4" />
                    팀 참여하기
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
