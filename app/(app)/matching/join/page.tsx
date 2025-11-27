'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Users, MapPin, Sparkles } from 'lucide-react'

// Mock 데이터 (매칭 페이지와 동일)
const mockTeams = [
  {
    id: '3',
    name: '강남 Thunder',
    shortName: 'GT',
    region: '강남구 역삼',
    level: 'A+',
    matchScore: 92,
    memberCount: 4,
    maxMembers: 5,
    isOfficial: false,
    captainId: 'user3',
    description: '1명 모집 중! 가드 포지션 우대합니다.',
    totalGames: 25,
    aiReports: 20,
    activeDays: 80,
  },
]

export default function JoinTeamsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTeams, setFilteredTeams] = useState(mockTeams)

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const filtered = mockTeams.filter(team =>
      team.name.toLowerCase().includes(query) ||
      team.region.toLowerCase().includes(query) ||
      team.level.toLowerCase().includes(query)
    )
    setFilteredTeams(filtered)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Button size="icon" variant="ghost" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">팀 참여하기</h1>
            <p className="text-xs text-muted-foreground">모집 중인 팀 전체 목록</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {/* 검색 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="팀 이름, 지역, 레벨로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/30 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* 팀 목록 */}
        {filteredTeams.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="border-border/50 bg-card">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-bold text-foreground">{team.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">레벨 {team.level}</Badge>
                          <span className="text-xs text-muted-foreground">{team.memberCount}/{team.maxMembers}명</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Sparkles className="h-4 w-4 text-primary inline" />
                      <span className="text-sm font-bold text-primary ml-1">{team.matchScore}%</span>
                    </div>
                  </div>
                  <div className="mb-3 flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{team.region}</span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{team.description}</p>
                  <Link href={`/team/${team.id}`}>
                    <Button variant="outline" className="w-full">참여하기</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
