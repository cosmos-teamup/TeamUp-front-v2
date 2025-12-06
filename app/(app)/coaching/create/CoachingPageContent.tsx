'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, TrendingDown, Minus, Sparkles, Calendar as CalendarIcon, Bot } from 'lucide-react'
import { getCurrentUser, addGameRecord, getAppData, setAppData } from '@/lib/storage'
import { BasketballCourt } from '@/components/features/coaching/basketball-court'
import { PositionFeedbackModal } from '@/components/features/coaching/position-feedback-modal'
import { CalendarModal } from '@/components/shared/calendar-modal'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { GameResult, Team, GameRecord } from '@/types'
import { coachingService, type FinishGameFeedbackRequest, FEEDBACK_TAG, GAME_RESULT } from '@/lib/services'
import { toast } from 'sonner'

// TODO: 백엔드 AI API 연동 대기
// 실제로는 POST /api/coaching/feedback { answers, result, teamDNA } 호출
function generateMockAIFeedback(
  answers: Record<string, string>,
  result: GameResult,
  teamDNA?: string
): string {
  // Mock: 팀 DNA에 맞는 간단한 피드백
  const dna = teamDNA || 'BULLS'
  const mockFeedbacks = {
    BULLS: '훌륭한 경기였습니다! Bulls DNA답게 강력한 수비와 투지를 보여줬습니다.',
    WARRIORS: '환상적인 팀플레이였습니다! Warriors 스타일의 즐거운 농구를 펼쳤네요.',
    SPURS: '완벽한 팀워크로 승리했습니다! Spurs의 정신을 제대로 보여줬습니다.',
  }
  return mockFeedbacks[dna as keyof typeof mockFeedbacks] || mockFeedbacks.BULLS
}

export default function CoachingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [opponent, setOpponent] = useState('')
  const [gameDate, setGameDate] = useState<Date>(new Date())
  const [result, setResult] = useState<GameResult | null>(null)
  const [matchedTeamId, setMatchedTeamId] = useState<string | null>(null)

  // DNA별 색상 스타일
  const getDnaStyle = (dna?: string) => {
    switch (dna) {
      case 'BULLS':
        return {
          bg: 'from-red-500/10 to-red-600/5',
          border: 'border-red-500/30',
          icon: 'text-red-600',
          text: 'text-red-600',
        }
      case 'WARRIORS':
        return {
          bg: 'from-blue-500/10 to-yellow-500/5',
          border: 'border-blue-500/30',
          icon: 'text-blue-600',
          text: 'text-blue-600',
        }
      case 'SPURS':
        return {
          bg: 'from-gray-500/10 to-gray-600/5',
          border: 'border-gray-500/30',
          icon: 'text-gray-600',
          text: 'text-gray-600',
        }
      default:
        return {
          bg: 'from-red-500/10 to-red-600/5',
          border: 'border-red-500/30',
          icon: 'text-red-600',
          text: 'text-red-600',
        }
    }
  }

  // 농구 코트 관련 상태
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feedbackAnswers, setFeedbackAnswers] = useState<Record<string, string>>({})

  // 캘린더 모달 상태
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    setCurrentTeam(user.team || null)

    // URL에서 matchedTeamId 가져오기
    const matchedId = searchParams.get('matchedTeamId')
    if (matchedId) {
      setMatchedTeamId(matchedId)
    }
  }, [router, searchParams])

  const handlePositionClick = (positionId: number, positionLabel: string) => {
    setSelectedPosition(positionId)
    setIsModalOpen(true)
  }

  const handleFeedbackSubmit = (answers: Record<string, string>) => {
    setFeedbackAnswers(answers)
  }

  const handleSubmit = async () => {
    if (!currentTeam || !opponent || !result) {
      toast.error('경기 결과를 선택해주세요.')
      return
    }

    if (Object.keys(feedbackAnswers).length === 0) {
      toast.error('농구 코트에서 포지션을 선택하여 피드백을 제출해주세요.')
      return
    }

    try {
      // 게임 ID는 matchedTeamId 또는 임시 생성
      const gameId = matchedTeamId ? Number(matchedTeamId) : Date.now()

      // 피드백 데이터 준비 (feedbackAnswers를 PositionFeedback 형식으로 변환)
      const positionFeedbacks = Object.entries(feedbackAnswers).map(([positionNumber, tags]) => ({
        positionNumber: Number(positionNumber),
        tags: tags.split(',').map(t => t.trim() as keyof typeof FEEDBACK_TAG) as any[], // 피드백 태그 배열
      }))

      // 게임 종료 및 피드백 제출 API 호출
      const feedbackRequest: FinishGameFeedbackRequest = {
        teamId: Number(currentTeam.id),
        result: result as keyof typeof GAME_RESULT,
        positionFeedbacks,
      }

      const feedbackResponse = await coachingService.finishGameAndFeedback(gameId, feedbackRequest)

      toast.success('피드백 제출 완료!')

      // AI 리포트 생성 API 호출
      const reportResponse = await coachingService.createReport(feedbackResponse.gameId, feedbackResponse.teamId)

      toast.success('AI 리포트 생성 완료!', {
        description: reportResponse.aiComment.substring(0, 50) + '...',
      })

      // localStorage에도 저장 (UI 표시용)
      const newRecord: GameRecord = {
        id: reportResponse.gameId.toString(),
        teamId: currentTeam.id,
        teamName: currentTeam.name,
        opponent,
        result,
        feedbackTag: 'TEAMWORK',
        aiComment: reportResponse.aiComment,
        gameDate: format(gameDate, 'yyyy-MM-dd'),
        createdAt: reportResponse.createdAt,
      }

      addGameRecord(newRecord)

      // 매칭된 팀 경기를 완료한 경우 해당 매칭 제거
      if (matchedTeamId) {
        const appData = getAppData()
        appData.matchedTeams = appData.matchedTeams.filter(m => m.id !== matchedTeamId)
        setAppData(appData)
      }

      // 상세 페이지로 이동
      router.push(`/coaching/${newRecord.id}`)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '피드백 제출에 실패했습니다.'
      toast.error('피드백 제출 실패', {
        description: errorMessage,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">경기 기록</h1>
              <p className="text-xs text-muted-foreground">포지션 기반 팀 피드백</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* AI 코치 DNA */}
        {currentTeam && (
          <Card className={`bg-gradient-to-br ${getDnaStyle(currentTeam.teamDna).bg} ${getDnaStyle(currentTeam.teamDna).border}`}>
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                <Bot className={`h-5 w-5 ${getDnaStyle(currentTeam.teamDna).icon} shrink-0`} />
                <div>
                  <p className={`text-sm font-bold ${getDnaStyle(currentTeam.teamDna).text}`}>
                    {currentTeam.teamDna === 'BULLS' && 'Chicago Bulls DNA'}
                    {currentTeam.teamDna === 'WARRIORS' && 'Golden State Warriors DNA'}
                    {currentTeam.teamDna === 'SPURS' && 'San Antonio Spurs DNA'}
                    {!currentTeam.teamDna && 'Chicago Bulls DNA'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    이 스타일의 AI 코치가 피드백을 제공합니다
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: 경기 정보 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            1️⃣ 경기 정보
          </h3>

          <div className="space-y-3">
            {/* 상대팀 이름 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                상대팀 이름
              </label>
              <Input
                placeholder="예: 세종 Twins"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                className="border-border/50 shadow-none"
              />
            </div>

            {/* 경기 날짜 (캘린더 모달) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                경기 날짜
              </label>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-border/50 shadow-none"
                onClick={() => setIsCalendarOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(gameDate, 'yyyy년 M월 d일 (E)', { locale: ko })}
              </Button>
            </div>
          </div>
        </div>

        {/* Step 2: 경기 결과 (원터치) */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            2️⃣ 경기 결과
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <Card
              className={`cursor-pointer border-2 transition-all ${
                result === 'WIN'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-border/50 hover:border-border'
              }`}
              onClick={() => setResult('WIN')}
            >
              <CardContent className="p-3 text-center">
                <TrendingDown className="mx-auto mb-1.5 h-7 w-7 rotate-180 text-green-500" />
                <p className="font-bold text-foreground">승리</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer border-2 transition-all ${
                result === 'LOSE'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-border/50 hover:border-border'
              }`}
              onClick={() => setResult('LOSE')}
            >
              <CardContent className="p-3 text-center">
                <TrendingDown className="mx-auto mb-1.5 h-7 w-7 text-red-500" />
                <p className="font-bold text-foreground">패배</p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer border-2 transition-all ${
                result === 'DRAW'
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-border/50 hover:border-border'
              }`}
              onClick={() => setResult('DRAW')}
            >
              <CardContent className="p-3 text-center">
                <Minus className="mx-auto mb-1.5 h-7 w-7 text-yellow-500" />
                <p className="font-bold text-foreground">무승부</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 3: 농구 코트 (포지션별 피드백) */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            3️⃣ 팀 피드백 제출
          </h3>

          <BasketballCourt
            onPositionClick={handlePositionClick}
            selectedPosition={selectedPosition}
          />

          {Object.keys(feedbackAnswers).length > 0 && (
            <Card className="mt-3 border-green-500/50 bg-green-500/10">
              <CardContent className="p-3">
                <p className="text-sm font-medium text-green-700">
                  ✓ 피드백이 제출되었습니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 제출 버튼 */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!result || Object.keys(feedbackAnswers).length === 0}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          AI 코칭 받기
        </Button>
      </main>

      {/* 캘린더 모달 */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={gameDate}
        onDateSelect={setGameDate}
      />

      {/* 포지션 피드백 모달 */}
      {selectedPosition && (
        <PositionFeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          positionId={selectedPosition}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  )
}
