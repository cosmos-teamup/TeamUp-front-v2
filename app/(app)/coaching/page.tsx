'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, Plus, Trophy, Target } from 'lucide-react'
import { getCurrentUser, getCurrentTeamGameRecords, getCurrentTeamStats } from '@/lib/storage'
import type { GameRecord, Team } from '@/types'

export default function CoachingPage() {
  const router = useRouter()
  const [records, setRecords] = useState<GameRecord[]>([])
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: 0
  })

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return

    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Storage에서 실제 데이터 가져오기
    const gameRecords = getCurrentTeamGameRecords()
    setRecords(gameRecords)

    // 현재 팀 정보
    setCurrentTeam(user.team || null)

    // 통계 계산
    const teamStats = getCurrentTeamStats()
    setStats(teamStats)
  }, [router])

  const getResultIcon = (result: GameRecord['result']) => {
    switch (result) {
      case 'WIN':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'LOSE':
        return <TrendingDown className="h-5 w-5 text-red-500" />
      case 'DRAW':
        return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const getResultBadge = (result: GameRecord['result']) => {
    switch (result) {
      case 'WIN':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">승리</Badge>
      case 'LOSE':
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">패배</Badge>
      case 'DRAW':
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">무승부</Badge>
    }
  }

  const getFeedbackTagLabel = (tag: GameRecord['feedbackTag']) => {
    const labels = {
      DEFENSE: '🛡️ 수비',
      OFFENSE: '⚡ 공격',
      MENTAL: '🧠 멘탈',
      TEAMWORK: '🤝 팀워크',
      STAMINA: '💪 체력'
    }
    return labels[tag]
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    return `${month}/${day} (${dayOfWeek})`
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
          <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
            <Image
              src="/images/logo.jpg"
              alt="TeamUp Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI 코칭</h1>
              <p className="text-sm text-muted-foreground">
                경기 분석과 맞춤형 조언
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
          {/* 통계 카드 */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-foreground">
                  {currentTeam?.name || '팀'} 전적
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stats.totalGames}</p>
                  <p className="text-xs text-muted-foreground">총 경기</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.wins}승</p>
                  <p className="text-xs text-muted-foreground">{stats.losses}패</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{stats.winRate}%</p>
                  <p className="text-xs text-muted-foreground">승률</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI 코칭 기록 리스트 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-foreground">코칭 기록</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {records.length}개의 피드백
              </p>
            </div>

            {records.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mb-2 font-medium text-foreground">
                    아직 코칭 기록이 없습니다
                  </p>
                  <p className="text-sm text-muted-foreground">
                    경기 후 간단한 피드백을 입력하면<br />
                    AI가 맞춤형 조언을 제공합니다
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <Link key={record.id} href={`/coaching/${record.id}`}>
                    <Card className="border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="p-4">
                        {/* 헤더: 날짜, 결과 */}
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getResultIcon(record.result)}
                            <span className="text-sm font-medium text-foreground">
                              {formatDate(record.gameDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getResultBadge(record.result)}
                            <Badge variant="outline" className="text-xs">
                              {getFeedbackTagLabel(record.feedbackTag)}
                            </Badge>
                          </div>
                        </div>

                        {/* 상대팀 */}
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground">
                            vs <span className="font-semibold text-foreground">{record.opponent}</span>
                          </p>
                        </div>

                        {/* AI 코멘트 미리보기 */}
                        <div className="rounded-lg bg-muted/30 p-3">
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {record.aiComment}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>

        <BottomNav />

        {/* 플로팅 버튼 - 경기 기록 추가 */}
        <Link href="/coaching/create">
          <Button
            size="lg"
            className="fixed bottom-24 right-6 z-30 h-14 w-14 rounded-full shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </>
  )
}
