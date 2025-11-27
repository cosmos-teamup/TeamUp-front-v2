'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Users, Check } from 'lucide-react'

// TODO: localStorage나 API에서 매칭된 팀 불러오기
const matchedTeams: any[] = []

export default function MatchedTeamsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTeams, setFilteredTeams] = useState(matchedTeams)

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const filtered = matchedTeams.filter(team =>
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
            <h1 className="text-xl font-bold tracking-tight">매칭된 팀</h1>
            <p className="text-xs text-muted-foreground">수락된 매칭 팀 전체 목록</p>
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Check className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">아직 매칭된 팀이 없습니다</p>
            <p className="mt-2 text-xs text-muted-foreground">
              매칭 요청을 보내고 상대가 수락하면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="border-green-500/50 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-bold text-foreground">{team.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">레벨 {team.level}</Badge>
                        <span className="text-xs text-muted-foreground">{team.region}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{team.description}</p>
                  <Link href={`/team/${team.id}`}>
                    <Button variant="outline" className="w-full">팀 상세보기</Button>
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
