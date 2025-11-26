'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sparkles, Calendar, MessageCircle, Plus, Search, MapPin, Users, X, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function HomePage() {
  // TODO: 실제로는 API로 팀 보유 여부 체크
  const [hasTeam, setHasTeam] = useState(true) // Mock: 팀 있음 상태로 시작
  const [teamName, setTeamName] = useState('세종 born')
  const [teamPhoto, setTeamPhoto] = useState('')
  const [showNearbyTeamsModal, setShowNearbyTeamsModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // localStorage에서 팀 정보 로드
    const savedName = localStorage.getItem('teamName')
    const savedPhoto = localStorage.getItem('teamPhoto')
    if (savedName) setTeamName(savedName)
    if (savedPhoto) setTeamPhoto(savedPhoto)
  }, [])

  // Mock: 주변 팀 데이터
  const nearbyTeams = [
    {
      id: 1,
      name: '관악 Thunders',
      location: '관악구 봉천동',
      distance: '1.2km',
      members: 6,
      level: 'A',
      sports: '농구',
      avatar: null,
      kakaoId: 'thunder_captain',
      totalMatches: 18,
      aiReports: 14,
      activeDays: 45,
    },
    {
      id: 2,
      name: '강남 Warriors',
      location: '강남구 역삼동',
      distance: '3.5km',
      members: 8,
      level: 'S',
      sports: '농구',
      avatar: null,
      kakaoId: 'warrior_leader',
      totalMatches: 32,
      aiReports: 28,
      activeDays: 120,
    },
    {
      id: 3,
      name: '서울 Tigers',
      location: '용산구 이촌동',
      distance: '4.8km',
      members: 7,
      level: 'A',
      sports: '농구',
      avatar: null,
      kakaoId: 'tigers_chief',
      totalMatches: 25,
      aiReports: 20,
      activeDays: 80,
    },
    {
      id: 4,
      name: '송파 Eagles',
      location: '송파구 잠실동',
      distance: '5.2km',
      members: 5,
      level: 'B',
      sports: '농구',
      avatar: null,
      kakaoId: 'eagles_boss',
      totalMatches: 12,
      aiReports: 10,
      activeDays: 30,
    },
    {
      id: 5,
      name: '마포 Phoenix',
      location: '마포구 상암동',
      distance: '6.1km',
      members: 6,
      level: 'A',
      sports: '농구',
      avatar: null,
      kakaoId: 'phoenix_head',
      totalMatches: 22,
      aiReports: 18,
      activeDays: 65,
    },
  ]

  const handleCopyKakaoId = async (kakaoId: string) => {
    try {
      await navigator.clipboard.writeText(kakaoId)
      setCopied(true)
      toast.success('카카오톡 ID가 복사되었습니다!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('복사에 실패했습니다.')
    }
  }

  const currentTeam = nearbyTeams.find((team) => team.id === selectedTeam)

  // 팀 없음 상태
  if (!hasTeam) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
          <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.jpg"
                alt="TeamUp Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain"
              />
              <h1 className="text-2xl font-bold tracking-tight">TeamUp</h1>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              AI Powered
            </Badge>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-4 py-6">
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-secondary">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-balance">아직 팀이 없습니다</h2>
            <p className="mb-8 text-foreground text-balance">
              팀을 만들거나 기존 팀에 참여하여<br />AI 매칭과 코칭을 시작하세요
            </p>

            <div className="flex w-full max-w-sm flex-col gap-3">
              <Link href="/matching" className="w-full">
                <Button className="w-full font-semibold" size="lg">
                  <Search className="mr-2 h-5 w-5" />
                  팀 찾기
                </Button>
              </Link>
              <Link href="/team/create" className="w-full">
                <Button variant="outline" className="w-full font-semibold" size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  팀 생성하기
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    )
  }

  // 팀 있음 상태
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.jpg"
              alt="TeamUp Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl object-contain"
            />
            <h1 className="text-2xl font-bold tracking-tight">TeamUp</h1>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            AI Powered
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">

        {/* 내 팀 섹션 */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            내 팀
          </h3>

          <Link href="/team">
            <Card className="cursor-pointer overflow-hidden border-border/50 bg-card transition-all hover:border-primary/50">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  {teamPhoto ? (
                    <img src={teamPhoto} alt="Team" className="h-16 w-16 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                      SB
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="mb-1 font-bold text-foreground">{teamName}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">팀원 5명</p>
                      <Badge variant="secondary" className="text-xs">레벨 A</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px border-t border-border/50 bg-border/50">
                  <div className="bg-card p-3 text-center">
                    <p className="text-lg font-bold text-foreground">18</p>
                    <p className="text-xs text-muted-foreground">총 경기</p>
                  </div>
                  <div className="bg-card p-3 text-center">
                    <p className="text-lg font-bold text-foreground">14</p>
                    <p className="text-xs text-muted-foreground">AI 리포트</p>
                  </div>
                  <div className="bg-card p-3 text-center">
                    <p className="text-lg font-bold text-foreground">45일</p>
                    <p className="text-xs text-muted-foreground">활동</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 팀 검색 */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            팀 찾기
          </h3>

          <div className="space-y-3">
            <Card
              className="cursor-pointer overflow-hidden border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent transition-all hover:border-primary/50"
              onClick={() => setShowNearbyTeamsModal(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 font-bold text-foreground">새로운 팀 찾기</h4>
                    <p className="text-xs text-muted-foreground">
                      함께 경기를 즐길 완벽한 팀을 찾아보세요
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Link href="/team/create">
              <Card className="cursor-pointer overflow-hidden border-border/50 bg-card transition-all hover:border-primary/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 font-bold text-foreground">팀 생성하기</h4>
                      <p className="text-xs text-muted-foreground">
                        새로운 팀을 만들고 팀원을 모집하세요
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* 최근 AI 코칭 */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">최근 AI 코칭</h3>
          </div>

          <Card className="border-border/50 bg-card">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">8월 10일 경기 분석</p>
                  <p className="text-xs text-muted-foreground">{teamName} vs 서울 Tigers</p>
                </div>
                <Badge className="bg-primary/10 text-primary">승리</Badge>
              </div>

              <div className="mb-3 space-y-2">
                <div className="rounded-lg bg-primary/5 p-3">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-primary">강점:</span> 팀워크가 우수하며 빠른 공격 전환이 돋보였습니다.
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/30 p-3">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-muted-foreground">개선점:</span> 수비 리바운드 강화가 필요합니다.
                  </p>
                </div>
              </div>

              <Link href="/coaching">
                <Button variant="outline" size="sm" className="w-full">
                  전체 코칭 보기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* 최근 활동 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            최근 활동
          </h3>

          <div className="space-y-2">
            <Card className="border-border/50 bg-card">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">새로운 매칭 요청</p>
                  <p className="text-xs text-muted-foreground">관악 Thunders가 매칭을 신청했습니다</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />

      {/* 주변 팀 모달 */}
      <Dialog open={showNearbyTeamsModal} onOpenChange={setShowNearbyTeamsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">주변 팀 찾기</DialogTitle>
            <DialogDescription>
              가까운 거리에 있는 팀들을 확인하고 함께 경기해보세요
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
            {nearbyTeams.map((team) => (
              <Card
                key={team.id}
                className="cursor-pointer border-border/50 bg-card transition-all hover:border-primary/50"
                onClick={() => setSelectedTeam(team.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {team.avatar ? (
                      <img
                        src={team.avatar}
                        alt={team.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                        {team.name.substring(0, 2)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-bold text-foreground">{team.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          레벨 {team.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{team.location}</span>
                        </div>
                        <span>•</span>
                        <span>{team.distance}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>팀원 {team.members}명</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowNearbyTeamsModal(false)}
            >
              닫기
            </Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <MapPin className="mr-2 h-4 w-4" />
              지도에서 보기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 팀 상세 모달 */}
      {currentTeam && (
        <Dialog open={selectedTeam !== null} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">팀 정보</DialogTitle>
            </DialogHeader>

            {/* Team Profile */}
            <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {currentTeam.avatar ? (
                      <img src={currentTeam.avatar} alt="Team" className="h-20 w-20 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                        {currentTeam.name.substring(0, 2)}
                      </div>
                    )}
                    <div>
                      <h2 className="mb-1 text-2xl font-bold text-foreground">{currentTeam.name}</h2>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/20 text-primary">레벨 {currentTeam.level}</Badge>
                        <Badge variant="secondary" className="text-xs">{currentTeam.location.split(' ')[0]}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-card/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">팀장 카카오톡 ID</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">{currentTeam.kakaoId}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyKakaoId(currentTeam.kakaoId)}
                      className="min-w-[60px]"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          완료
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-4 w-4" />
                          복사
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-card/50 p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{currentTeam.totalMatches}</p>
                    <p className="text-xs text-muted-foreground">총 경기</p>
                  </div>
                  <div className="rounded-lg bg-card/50 p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{currentTeam.aiReports}</p>
                    <p className="text-xs text-muted-foreground">AI 리포트</p>
                  </div>
                  <div className="rounded-lg bg-card/50 p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{currentTeam.activeDays}일</p>
                    <p className="text-xs text-muted-foreground">활동</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setSelectedTeam(null)}
            >
              닫기
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
