// AI 코칭 관련 API
import { post, get } from './client'

export interface AIFeedbackRequest {
  teamId: string
  teamDNA: string
  gameResult: 'WIN' | 'LOSE' | 'DRAW'
  feedbackAnswers: Record<string, string> // 4개 질문의 답변
  opponent: string
  gameDate: string
}

export interface AIFeedbackResponse {
  id: string
  teamId: string
  gameResult: 'WIN' | 'LOSE' | 'DRAW'
  opponent: string
  gameDate: string
  feedback: string
  createdAt: string
}

export interface MatchScoreRequest {
  userId: string
  teamId: string
}

export interface MatchScoreResponse {
  score: number
  reason: string
}

export const coachingService = {
  // AI 피드백 생성 (경기 후)
  generateAIFeedback: async (
    data: AIFeedbackRequest
  ): Promise<AIFeedbackResponse> => {
    return post<AIFeedbackResponse>('/ai/coaching/feedback', data)
  },

  // 매칭 점수 계산
  getMatchScore: async (
    data: MatchScoreRequest
  ): Promise<MatchScoreResponse> => {
    return post<MatchScoreResponse>('/ai/match-score', data)
  },

  // 코칭 레포트 생성
  generateCoachingReport: async (gameId: string): Promise<unknown> => {
    return post('/ai/coaching-report', { gameId })
  },

  // 추천 팀 조회
  getRecommendedTeams: async (userId: string): Promise<unknown[]> => {
    return get(`/ai/recommend-teams?userId=${userId}`)
  },
}
