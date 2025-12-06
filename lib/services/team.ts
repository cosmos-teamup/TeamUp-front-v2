// 팀 관련 API
import { get, post, del } from './client'
import type { Team } from '@/types'

export interface CreateTeamRequest {
  name: string
  region: string
  level: string
  preferredTime?: string | null
  playStyle?: string | null
  gameFrequency?: string | null
  teamMood?: string | null
  travelDistance?: string | null
  maxMembers?: number
  description?: string
}

export interface TeamDetail extends Team {
  captain: {
    id: string
    nickname: string
    email: string
  }
  members: Array<{
    id: string
    nickname: string
    position: string
  }>
}

export interface JoinTeamRequest {
  message?: string
}

export const teamService = {
  // 내 팀 목록 조회
  getMyTeams: async (): Promise<Team[]> => {
    return get<Team[]>('/teams/my')
  },

  // 팀 상세 조회
  getTeam: async (id: string): Promise<Team> => {
    return get<Team>(`/teams/${id}`)
  },

  // 팀 검색
  searchTeams: async (
    query: string,
    filters?: { region?: string; level?: string }
  ): Promise<Team[]> => {
    const params = new URLSearchParams({
      q: query,
      ...(filters?.region && { region: filters.region }),
      ...(filters?.level && { level: filters.level }),
    })
    return get<Team[]>(`/teams/search?${params}`)
  },

  // 팀 생성
  createTeam: async (data: CreateTeamRequest): Promise<Team> => {
    return post<Team>('/teams', data)
  },

  // 팀 탈퇴
  leaveTeam: async (teamId: string): Promise<void> => {
    return post(`/teams/${teamId}/leave`)
  },

  // 팀 상세 정보 (멤버 포함)
  getTeamDetail: async (teamId: string): Promise<TeamDetail> => {
    return get<TeamDetail>(`/teams/${teamId}/detail`)
  },

  // 팀 멤버 조회
  getTeamMembers: async (teamId: string): Promise<TeamDetail['members']> => {
    return get<TeamDetail['members']>(`/teams/${teamId}/members`)
  },

  // 팀 멤버십 확인
  checkTeamMembership: async (teamId: string): Promise<{ isMember: boolean }> => {
    return get<{ isMember: boolean }>(`/teams/${teamId}/is-member`)
  },

  // 팀 참여 요청
  joinTeam: async (teamId: string, data?: JoinTeamRequest): Promise<void> => {
    return post(`/teams/${teamId}/join`, data)
  },

  // 팀장 연락처 조회
  getTeamContact: async (teamId: string): Promise<{ kakaoId: string }> => {
    return get<{ kakaoId: string }>(`/teams/${teamId}/contact`)
  },
}
