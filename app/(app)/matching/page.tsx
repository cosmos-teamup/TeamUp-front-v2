'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sparkles, Search, Plus, Users, MapPin, AlertCircle, Check } from 'lucide-react'
import { toast } from 'sonner'
import { getReceivedMatchRequests, updateMatchRequestStatus, formatTimeAgo } from '@/lib/storage'
import type { Team, MatchRequest } from '@/types'

// Mock 데이터 (나중에 API로 교체)
const mockMyTeam: Team = {
  id: '1',
  name: '세종 born',
  shortName: 'SB',
  memberCount: 5,
  maxMembers: 5,
  level: 'A',
  region: '광진구 능동',
  totalGames: 18,
  aiReports: 14,
  activeDays: 45,
  isOfficial: true,
  captainId: 'user1',
  description: '세종대 기반 농구 동호회',
}

const mockTeams: Team[] = [
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

export default function MatchingPage() {
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([])
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [showAllRequestsModal, setShowAllRequestsModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  // 팀 분류
  const joinTeams = mockTeams.filter(t => !t.isOfficial) // 모집 중
  const matchTeams = mockTeams.filter(t => t.isOfficial) // 정식 팀
  const matchedTeams: Team[] = [] // TODO: 매칭된 팀 (localStorage에서 로드)

  // localStorage에서 받은 매칭 요청 로드
  useEffect(() => {
    loadMatchRequests()
  }, [])

  const loadMatchRequests = () => {
    const requests = getReceivedMatchRequests()
    setMatchRequests(requests)
  }

  // TODO: 실제 API 연동
  // useEffect(() => {
  //   const loadData = async () => {
  //     const teams = await api.getRecommendedTeams()
  //     const matched = await api.getMatchedTeams()
  //     setMatchRequests(await api.getMatchRequests())
  //   }
  //   loadData()
  // }, [])

  const handleMatchRequest = (team: Team) => {
    setSelectedTeam(team)
    setShowMatchModal(true)
  }

  const confirmMatchRequest = () => {
    setShowMatchModal(false)
    alert(`${selectedTeam?.name}에 매칭 요청을 보냈습니다!`)
    // TODO: 실제 API 연동
    // await api.sendMatchRequest(selectedTeam.id, mockMyTeam.id, '경기 한 번 하시죠!')
  }

  const handleAcceptRequest = (requestId: string, teamName: string) => {
    updateMatchRequestStatus(requestId, 'accepted')
    toast.success(`${teamName}의 매칭 요청을 수락했습니다!`)
    loadMatchRequests()
    // TODO: 실제 API 연동
    // await api.acceptMatchRequest(requestId)
  }

  const handleRejectRequest = (requestId: string) => {
    updateMatchRequestStatus(requestId, 'rejected')
    toast.success('매칭 요청을 거절했습니다')
    loadMatchRequests()
    // TODO: 실제 API 연동
    // await api.rejectMatchRequest(requestId)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">팀 매칭</h1>
            <p className="text-sm text-muted-foreground">AI가 추천하는 최적의 팀</p>
          </div>
          <Link href="/team/create">
            <Button size="sm" className="font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              팀 생성
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {/* 받은 매칭 요청 */}
        {matchRequests.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-foreground">받은 매칭 요청</h2>
                <Badge className="bg-primary">{matchRequests.length}</Badge>
              </div>
              {matchRequests.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllRequestsModal(true)}
                  className="text-primary hover:text-primary"
                >
                  전체
                </Button>
              )}
            </div>
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 font-bold text-foreground">{matchRequests[0].fromTeam.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">레벨 {matchRequests[0].fromTeam.level}</Badge>
                      <span className="text-xs text-muted-foreground">{matchRequests[0].fromTeam.region}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(matchRequests[0].createdAt)}</span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{matchRequests[0].message}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRejectRequest(matchRequests[0].id)}
                  >
                    거절
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleAcceptRequest(matchRequests[0].id, matchRequests[0].fromTeam.name)}
                  >
                    수락하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI 추천 안내 */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/10 p-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">AI 추천 팀</p>
            <p className="text-xs text-muted-foreground">매칭 점수 기반 정렬</p>
          </div>
        </div>

        {/* 팀 참여하기 */}
        {joinTeams.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-foreground">팀 참여하기</h2>
                <Badge variant="secondary" className="text-xs">모집 중</Badge>
              </div>
              {joinTeams.length > 1 && (
                <Link href="/matching/join">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary"
                  >
                    전체
                  </Button>
                </Link>
              )}
            </div>
            <Card className="border-border/50 bg-card">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-foreground">{joinTeams[0].name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">레벨 {joinTeams[0].level}</Badge>
                        <span className="text-xs text-muted-foreground">{joinTeams[0].memberCount}/{joinTeams[0].maxMembers}명</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-primary">{joinTeams[0].matchScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{joinTeams[0].region}</span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{joinTeams[0].description}</p>
                <Link href={`/team/${joinTeams[0].id}`}>
                  <Button variant="outline" className="w-full">참여하기</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 팀 매칭하기 */}
        {matchTeams.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-foreground">팀 매칭하기</h2>
                <Badge className="bg-primary/10 text-primary text-xs">정식 팀</Badge>
              </div>
              {matchTeams.length > 1 && (
                <Link href="/matching/teams">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary"
                  >
                    전체
                  </Button>
                </Link>
              )}
            </div>
            <Card className="border-border/50 bg-card">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-foreground">{matchTeams[0].name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">레벨 {matchTeams[0].level}</Badge>
                        <span className="text-xs text-muted-foreground">{matchTeams[0].memberCount}/{matchTeams[0].maxMembers}명</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-primary">{matchTeams[0].matchScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{matchTeams[0].region}</span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{matchTeams[0].description}</p>
                <Button className="w-full" onClick={() => handleMatchRequest(matchTeams[0])}>매칭하기</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 매칭된 팀 */}
        {matchedTeams.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <h2 className="font-bold text-foreground">매칭된 팀</h2>
                <Badge className="bg-green-500/10 text-green-600 text-xs">수락됨</Badge>
              </div>
              {matchedTeams.length > 1 && (
                <Link href="/matching/matched">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary"
                  >
                    전체
                  </Button>
                </Link>
              )}
            </div>
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-bold text-foreground">{matchedTeams[0].name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">레벨 {matchedTeams[0].level}</Badge>
                      <span className="text-xs text-muted-foreground">{matchedTeams[0].region}</span>
                    </div>
                  </div>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{matchedTeams[0].description}</p>
                <Link href={`/team/${matchedTeams[0].id}`}>
                  <Button variant="outline" className="w-full">팀 상세보기</Button>
                </Link>
              </CardContent>
            </Card>
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
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowMatchModal(false)}
                >
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={confirmMatchRequest}
                >
                  요청 보내기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 받은 매칭 요청 전체 모달 */}
      <Dialog open={showAllRequestsModal} onOpenChange={setShowAllRequestsModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              받은 매칭 요청 ({matchRequests.length}개)
            </DialogTitle>
            <DialogDescription>
              팀에서 받은 매칭 요청을 확인하고 수락/거절할 수 있습니다
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {matchRequests.map((request) => (
              <Card key={request.id} className="border-border/50 bg-card">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                      {request.fromTeam.shortName}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-bold text-foreground">{request.fromTeam.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          레벨 {request.fromTeam.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{request.fromTeam.region}</p>
                    </div>
                  </div>

                  <div className="mb-3 rounded-lg bg-secondary/30 p-3">
                    <p className="text-sm text-foreground">&quot;{request.message}&quot;</p>
                  </div>

                  <p className="mb-3 text-xs text-muted-foreground">
                    {formatTimeAgo(request.createdAt)}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        handleRejectRequest(request.id)
                        if (matchRequests.length === 1) setShowAllRequestsModal(false)
                      }}
                    >
                      거절
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleAcceptRequest(request.id, request.fromTeam.name)
                        if (matchRequests.length === 1) setShowAllRequestsModal(false)
                      }}
                    >
                      수락
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  )
}
