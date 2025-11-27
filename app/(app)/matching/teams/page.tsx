'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Users, MapPin, Sparkles } from 'lucide-react'

// Mock 데이터
const mockTeams = [
  {
    id: '2',
    name: '세종 Warriors',
    shortName: 'SW',
    region: '광진구 능동',
    level: 'A',
    matchScore: 95,
    memberCount: 5,
    maxMembers: 5,
    isOfficial: true,
    captainId: 'user2',
    description: '주말 오후에 활동하는 친목 위주 팀입니다.',
    totalGames: 20,
    aiReports: 15,
    activeDays: 60,
  },
  {
    id: '4',
    name: '관악 Hoops',
    shortName: 'GH',
    region: '관악구 신림',
    level: 'B+',
    matchScore: 88,
    memberCount: 5,
    maxMembers: 5,
    isOfficial: true,
    captainId: 'user4',
    description: '주 2회 정기 경기를 진행합니다.',
    totalGames: 15,
    aiReports: 12,
    activeDays: 40,
  },
  {
    id: '5',
    name: '송파 Dunk',
    shortName: 'SD',
    region: '송파구 잠실',
    level: 'A',
    matchScore: 90,
    memberCount: 5,
    maxMembers: 5,
    isOfficial: true,
    captainId: 'user5',
    description: '잠실 코트에서 주로 활동합니다.',
    totalGames: 22,
    aiReports: 18,
    activeDays: 55,
  },
]

export default function MatchTeamsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTeams, setFilteredTeams] = useState(mockTeams)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<typeof mockTeams[0] | null>(null)

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const filtered = mockTeams.filter(team =>
      team.name.toLowerCase().includes(query) ||
      team.region.toLowerCase().includes(query) ||
      team.level.toLowerCase().includes(query)
    )
    setFilteredTeams(filtered)
  }, [searchQuery])

  const handleMatchRequest = (team: typeof mockTeams[0]) => {
    setSelectedTeam(team)
    setShowMatchModal(true)
  }

  const confirmMatchRequest = () => {
    setShowMatchModal(false)
    alert(`${selectedTeam?.name}에 매칭 요청을 보냈습니다!`)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Button size="icon" variant="ghost" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">팀 매칭하기</h1>
            <p className="text-xs text-muted-foreground">정식 팀 전체 목록</p>
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
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
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
                  <Button className="w-full" onClick={() => handleMatchRequest(team)}>매칭하기</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* 매칭 요청 모달 */}
      {showMatchModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm border-border/50 bg-card">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold text-foreground">매칭 요청</h3>
              <div className="mb-6">
                <p className="mb-2 text-sm text-muted-foreground">상대 팀</p>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <p className="font-bold text-foreground">{selectedTeam.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedTeam.region}</p>
                </div>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">
                이 팀에 매칭 요청을 보낼까요?<br />
                상대 팀이 수락하면 팀장끼리 카카오톡으로 연락할 수 있습니다.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowMatchModal(false)}>
                  취소
                </Button>
                <Button className="flex-1" onClick={confirmMatchRequest}>
                  요청 보내기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
