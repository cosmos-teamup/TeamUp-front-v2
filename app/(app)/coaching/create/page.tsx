'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trophy, TrendingDown, Minus, Sparkles } from 'lucide-react'
import { getCurrentUser, addGameRecord } from '@/lib/storage'
import type { GameResult, FeedbackTag, Team, TeamDNA, GameRecord } from '@/types'

// 피드백 태그 정의
const FEEDBACK_TAGS: { value: FeedbackTag; label: string; icon: string }[] = [
  { value: 'DEFENSE', label: '수비', icon: '🛡️' },
  { value: 'OFFENSE', label: '공격', icon: '⚡' },
  { value: 'MENTAL', label: '멘탈', icon: '🧠' },
  { value: 'TEAMWORK', label: '팀워크', icon: '🤝' },
  { value: 'STAMINA', label: '체력', icon: '💪' },
]

// DNA별 AI 조언 템플릿
const AI_COACHING_TEMPLATES = {
  BULLS: {
    WIN: {
      DEFENSE: [
        '훌륭한 승리입니다! Bulls DNA답게 강력한 수비로 상대를 압박했습니다. 특히 후반 5분간 상대의 득점을 완벽하게 차단한 점이 돋보였습니다. 다음 경기에서는 리바운드 싸움에서 더욱 공격적으로 움직여보세요. Jordan이 말했듯, "Defense wins championships!"',
        '완벽한 수비력이었습니다! 시카고 불스의 정신을 제대로 보여줬네요. 상대의 핵심 플레이어를 효과적으로 막아냈습니다. Pippen의 말처럼 "수비는 팀워크다"를 실천했습니다. 다음엔 빠른 역습으로 연결해보세요!',
      ],
      OFFENSE: [
        '공격적인 플레이로 승리를 이끌었습니다! 하지만 Bulls는 수비에서 시작합니다. 다음 경기에선 수비적 기반 위에 공격을 쌓아보세요. Jordan도 득점왕이기 전에 수비수였다는 걸 기억하세요!',
      ],
      MENTAL: [
        '멘탈이 흔들리는 순간에도 집중력을 유지했습니다! Bulls의 정신력을 제대로 보여줬네요. 동점 상황에서도 침착하게 플레이를 풀어간 점이 승리의 핵심이었습니다. Phil Jackson 감독이 강조했던 "Stay in the moment"를 완벽히 실천했습니다.',
      ],
      TEAMWORK: [
        '팀워크로 승리를 만들어냈습니다! Jordan과 Pippen의 호흡처럼 완벽한 조화였습니다. 하지만 Bulls는 "투지"도 중요합니다. 다음 경기에선 더 공격적인 수비로 상대를 압박해보세요!',
      ],
      STAMINA: [
        '끝까지 체력을 유지하며 승리했습니다! Bulls는 4쿼터에 강한 팀입니다. 하지만 초반부터 강한 수비로 상대의 체력을 소진시키는 것도 전략입니다. 다음엔 시작부터 압박해보세요!',
      ],
    },
    LOSE: {
      DEFENSE: [
        '아쉬운 패배지만 포기하지 마세요. Bulls는 역경 속에서 더 강해집니다. 수비에선 좋은 모습을 보였지만, 다음엔 더 공격적으로 리바운드를 잡아보세요. Rodman처럼 모든 볼을 내 것으로 만드는 집착이 필요합니다!',
      ],
      OFFENSE: [
        '아쉬운 패배지만 포기하지 마세요. Bulls는 역경 속에서 더 강해집니다. 공격 시도는 좋았지만 슛 성공률이 낮았습니다. 다음 경기에선 더 가까운 거리에서 확실한 슛을 노려보세요. Pippen처럼 팀원과의 호흡을 맞춰 공간을 만들어내는 것도 좋은 방법입니다.',
      ],
      MENTAL: [
        '힘든 경기였지만 잘 버텼습니다. Jordan도 수많은 패배를 경험했습니다. 중요한 건 다음 경기입니다. 오늘의 아쉬움을 수비 훈련으로 풀어보세요. Bulls는 수비로 자신감을 회복합니다!',
      ],
      TEAMWORK: [
        '팀워크는 좋았지만 결과가 아쉽네요. Bulls는 "함께 싸우는" 팀입니다. 다음 경기에선 수비에서 더 큰 소리로 서로를 격려하며 상대를 압박해보세요. 투지는 소통에서 나옵니다!',
      ],
      STAMINA: [
        '체력이 고비였네요. Bulls도 3-peat 시절 여름 훈련의 강도가 유명했습니다. 기초 체력을 보강하고, 경기 중 효율적인 에너지 배분을 연습해보세요. 수비에 집중하면 공격 체력을 아낄 수 있습니다!',
      ],
    },
  },
  WARRIORS: {
    WIN: {
      OFFENSE: [
        '환상적인 공격력이었습니다! Warriors DNA답게 재미있는 농구를 보여줬네요. 특히 빠른 패스와 3점슛이 돋보였습니다. Curry처럼 자신감 있게 슛을 던지는 모습이 멋졌습니다. 다음엔 더 많은 어시스트로 팀원들과 기쁨을 나눠보세요!',
        '불꽃같은 공격이었습니다! "Strength in Numbers"를 제대로 실천했네요. 모두가 득점 기회를 가진 아름다운 농구였습니다. Klay Thompson의 말처럼 "Just shoot it"을 실천했습니다!',
      ],
      DEFENSE: [
        '수비도 좋았지만, Warriors는 공격으로 상대를 압도하는 팀입니다! 다음 경기에선 더 빠른 템포로 상대가 수비를 준비할 틈을 주지 마세요. Draymond처럼 수비 리바운드 후 즉시 역습!',
      ],
      MENTAL: [
        '침착한 플레이로 승리했습니다! Kerr 감독의 "Joy of basketball"을 느꼈나요? 즐기면서도 집중력을 유지하는 게 Warriors의 강점입니다. 다음엔 더 과감하게 3점슛을 시도해보세요!',
      ],
      TEAMWORK: [
        '완벽한 팀플레이였습니다! Warriors의 모토 "Strength in Numbers"를 제대로 보여줬네요. 모든 선수가 빛났습니다. 다음 경기에선 더 많은 3점 시도로 점수 차를 벌려보세요!',
      ],
      STAMINA: [
        '끝까지 빠른 템포를 유지했습니다! Warriors의 "Run and Gun"을 완벽히 소화했네요. 하지만 체력을 아끼는 것도 중요합니다. 효율적인 3점슛으로 적은 에너지로 큰 효과를 노려보세요!',
      ],
    },
    LOSE: {
      OFFENSE: [
        '슛이 잘 안 들어가는 날이었네요. Curry도 슬럼프가 있습니다. 중요한 건 계속 던지는 겁니다! "You miss 100% of the shots you don\'t take." 다음 경기엔 더 자신감 있게 3점슛을 노려보세요. 재미를 잃지 마세요!',
      ],
      DEFENSE: [
        '수비에서 아쉬움이 있었지만, Warriors는 공격으로 답합니다! 다음 경기에선 더 빠른 공격으로 상대가 수비를 준비할 시간을 주지 마세요. 템포를 높이면 승기가 보입니다!',
      ],
      MENTAL: [
        '힘든 경기였지만 괜찮습니다. Warriors는 "즐거운 농구"를 추구합니다. 다음 경기는 부담 내려놓고 재미있게 뛰어보세요. Curry의 미소처럼 여유를 가지면 슛도 더 잘 들어갑니다!',
      ],
      TEAMWORK: [
        '패스는 좋았지만 결과가 아쉽네요. "Motion offense"의 핵심은 끊임없는 움직임입니다. 다음 경기엔 공간을 더 넓게 활용하고, 과감하게 3점슛을 시도해보세요!',
      ],
      STAMINA: [
        '체력이 고비였네요. Warriors의 빠른 템포를 유지하려면 체력이 필수입니다. 하지만 효율성도 중요합니다. 3점슛 성공률을 높여 적은 에너지로 큰 효과를 노려보세요!',
      ],
    },
  },
  SPURS: {
    WIN: {
      TEAMWORK: [
        '완벽한 팀워크로 승리했습니다! Spurs DNA를 제대로 보여줬네요. "The beautiful game"처럼 모두가 터치하는 농구가 아름다웠습니다. Pop 감독님도 만족하실 플레이였습니다. 다음엔 더 정확한 패스로 완성도를 높여보세요!',
        '환상적인 팀플레이였습니다! Duncan, Parker, Ginobili의 호흡처럼 완벽했습니다. "Pounding the Rock"의 정신으로 꾸준히 기본을 다지니 승리가 왔습니다!',
      ],
      DEFENSE: [
        '견고한 수비였습니다! Spurs의 시스템 수비를 제대로 구사했네요. 하지만 Spurs는 패스가 생명입니다. 다음 경기에선 수비 리바운드 후 빠른 패스로 연결해보세요!',
      ],
      OFFENSE: [
        '좋은 공격이었지만, Spurs는 "팀 농구"가 우선입니다. 다음 경기에선 한 명이 5번 이상 볼을 터치하지 않도록 빠른 패스를 유지해보세요. "Ball movement creates good shots!"',
      ],
      MENTAL: [
        '침착하고 인내심 있는 플레이였습니다! Spurs의 "Pounding the Rock" 철학을 실천했네요. 한 번의 패스가 안 되면 두 번, 세 번... 결국 기회가 왔습니다. Pop의 가르침을 잘 따랐습니다!',
      ],
      STAMINA: [
        '끝까지 안정적인 플레이를 유지했습니다! Spurs는 "Fundamentals"를 중시합니다. 체력 관리도 기본입니다. 다음엔 경기 중 에너지 배분을 더 효율적으로 해보세요!',
      ],
    },
    LOSE: {
      TEAMWORK: [
        '팀워크는 좋았지만 결과가 아쉽네요. Spurs는 "Process over results"를 믿습니다. 오늘 좋은 패스 플레이를 많이 만들어냈다면 그것만으로도 의미 있습니다. 계속 기본에 충실하면 승리는 따라옵니다!',
      ],
      DEFENSE: [
        '수비에서 아쉬움이 있었네요. Spurs의 시스템 수비는 "5명이 하나"입니다. 다음 경기에선 로테이션 콜을 더 크게 하며 소통을 강화해보세요. Duncan처럼 묵묵히 자리를 지키는 것도 중요합니다!',
      ],
      OFFENSE: [
        '공격에서 아쉬움이 있었지만 괜찮습니다. Pop 감독님의 말처럼 "Pounding the Rock" - 바위를 계속 두드리다 보면 언젠가 깨집니다. 기본기를 더 다지고, 정확한 패스 연습을 해보세요!',
      ],
      MENTAL: [
        '힘든 경기였지만 잘 버텼습니다. Spurs는 "인내"의 팀입니다. 급하게 승리를 쫓지 마세요. 기본에 충실하면 자연스럽게 좋은 결과가 옵니다. "Trust the process!"',
      ],
      STAMINA: [
        '체력이 고비였네요. Spurs는 효율성을 중시합니다. 무리한 플레이보다 정확한 패스와 좋은 포지셔닝으로 에너지를 아껴보세요. Tim Duncan처럼 "Bank shot"같이 확실한 플레이를 선택하세요!',
      ],
    },
  },
}

// AI 코멘트 생성 함수
function generateAIComment(
  result: GameResult,
  tag: FeedbackTag,
  teamDNA?: TeamDNA
): string {
  const dna = teamDNA || 'BULLS'
  const templates = AI_COACHING_TEMPLATES[dna][result]?.[tag]

  if (templates && templates.length > 0) {
    return templates[Math.floor(Math.random() * templates.length)]
  }

  // 기본 메시지
  return result === 'WIN'
    ? '훌륭한 경기였습니다! 이 기세를 이어가세요.'
    : '아쉬운 경기였지만 다음 기회에 더 잘할 수 있을 겁니다!'
}

export default function CreateCoachingPage() {
  const router = useRouter()
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [opponent, setOpponent] = useState('')
  const [gameDate, setGameDate] = useState('')
  const [result, setResult] = useState<GameResult | null>(null)
  const [selectedTag, setSelectedTag] = useState<FeedbackTag | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }

    const team = user.teams.find(t => t.id === user.currentTeamId)
    setCurrentTeam(team || null)

    // 오늘 날짜를 기본값으로
    const today = new Date().toISOString().split('T')[0]
    setGameDate(today)
  }, [router])

  const handleSubmit = () => {
    if (!currentTeam || !opponent || !gameDate || !result || !selectedTag) {
      alert('모든 항목을 입력해주세요.')
      return
    }

    // AI 코멘트 생성
    const aiComment = generateAIComment(result, selectedTag, currentTeam.teamDna)

    // Storage에 저장
    const newRecord: GameRecord = {
      id: `rec_${Date.now()}`,
      teamId: currentTeam.id,
      teamName: currentTeam.name,
      opponent,
      result,
      feedbackTag: selectedTag,
      aiComment,
      gameDate,
      createdAt: new Date().toISOString(),
    }

    // Storage에 추가
    addGameRecord(newRecord)

    // 성공 알림 후 상세 페이지로 이동
    router.push(`/coaching/${newRecord.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
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
              <p className="text-xs text-muted-foreground">3초만에 AI 코칭 받기</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* 팀 정보 */}
        {currentTeam && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{currentTeam.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {currentTeam.teamDna || 'BULLS'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Lv.{currentTeam.teamLevel || 1}
                    </Badge>
                  </div>
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
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                상대팀 이름
              </label>
              <Input
                placeholder="예: 광진 Thunder"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                className="bg-background"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                경기 날짜
              </label>
              <Input
                type="date"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="bg-background"
              />
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
              <CardContent className="p-4 text-center">
                <TrendingDown className="mx-auto mb-2 h-8 w-8 rotate-180 text-green-500" />
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
              <CardContent className="p-4 text-center">
                <TrendingDown className="mx-auto mb-2 h-8 w-8 text-red-500" />
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
              <CardContent className="p-4 text-center">
                <Minus className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                <p className="font-bold text-foreground">무승부</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 3: 피드백 태그 (원터치) */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            3️⃣ 집중 분야 (하나만 선택)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {FEEDBACK_TAGS.map((tag) => (
              <Card
                key={tag.value}
                className={`cursor-pointer border-2 transition-all ${
                  selectedTag === tag.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 hover:border-border'
                }`}
                onClick={() => setSelectedTag(tag.value)}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-2 text-3xl">{tag.icon}</div>
                  <p className="font-bold text-foreground">{tag.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!opponent || !result || !selectedTag}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          AI 코칭 받기
        </Button>
      </main>
    </div>
  )
}
