import type { Court, NearbyTeam } from '@/types';

// API 클라이언트 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Fetch wrapper with error handling
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Fetch wrapper for text responses
async function fetchText(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.statusText}`);
  }

  return response.text();
}

// Mock 데이터 (백엔드 완성 전까지 사용)
const mockCourts: Court[] = [];
const mockNearbyTeams: NearbyTeam[] = [];

export const api = {
  // ========== Auth APIs (패스워드리스) ==========
  // 1️⃣ 이메일 인증코드 요청
  requestEmailVerification: (email: string) =>
    fetchText('/email/verify/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // 2️⃣ 이메일 인증코드 확인
  confirmEmailVerification: (email: string, code: string) =>
    fetchText('/email/verify/confirm', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),

  // 3️⃣ 회원가입
  register: (data: {
    email: string;
    nickname: string;
    mainPosition: string;
    subPosition?: string;
    gender: string;
    age: number;
    address: string;
  }) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // User APIs
  getMe: () => fetchAPI('/users/me'),
  getUser: (id: string) => fetchAPI(`/users/${id}`),
  getUserByEmail: (email: string) => fetchAPI(`/user?email=${email}`),
  getAllUsers: () => fetchAPI('/user/all'),
  deleteUserByEmail: (email: string) =>
    fetchAPI(`/user/by-email?email=${email}`, {
      method: 'DELETE',
    }),

  // Team APIs
  getMyTeams: () => fetchAPI('/teams/my'),
  getTeam: (id: string) => fetchAPI(`/teams/${id}`),
  searchTeams: (query: string, filters?: { region?: string; level?: string }) =>
    fetchAPI(`/teams/search?q=${query}&region=${filters?.region || ''}&level=${filters?.level || ''}`),

  // 팀 생성
  createTeam: (data: {
    name: string;
    region: string;
    level: string;
    preferredTime?: string | null;
    playStyle?: string | null;
    gameFrequency?: string | null;
    teamMood?: string | null;
    travelDistance?: string | null;
    maxMembers?: number;
    description?: string;
  }) =>
    fetchAPI('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 팀 탈퇴
  leaveTeam: (teamId: string) =>
    fetchAPI(`/teams/${teamId}/leave`, {
      method: 'POST',
    }),

  // Team Detail & Join APIs
  getTeamDetail: (teamId: string) => fetchAPI(`/teams/${teamId}/detail`),
  getTeamMembers: (teamId: string) => fetchAPI(`/teams/${teamId}/members`),
  checkTeamMembership: (teamId: string) => fetchAPI(`/teams/${teamId}/is-member`),

  // 팀 참여 요청
  joinTeam: (teamId: string, data?: { message?: string }) =>
    fetchAPI(`/teams/${teamId}/join`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  // 팀장 연락처
  getTeamContact: (teamId: string) => fetchAPI(`/teams/${teamId}/contact`),

  // Match Request APIs
  getMatchRequests: () => fetchAPI('/match-requests/received'),
  getSentMatchRequests: () => fetchAPI('/match-requests/sent'),
  sendMatchRequest: (toTeamId: string, fromTeamId: string, message: string) =>
    fetchAPI('/match-requests', {
      method: 'POST',
      body: JSON.stringify({ toTeamId, fromTeamId, message }),
    }),
  acceptMatchRequest: (requestId: string) =>
    fetchAPI(`/match-requests/${requestId}/accept`, {
      method: 'PUT',
    }),
  rejectMatchRequest: (requestId: string) =>
    fetchAPI(`/match-requests/${requestId}/reject`, {
      method: 'PUT',
    }),

  // Notification APIs
  getNotifications: () => fetchAPI('/notifications'),
  markNotificationAsRead: (notificationId: string) =>
    fetchAPI(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),
  markAllNotificationsAsRead: () =>
    fetchAPI('/notifications/read-all', {
      method: 'PUT',
    }),

  // AI APIs
  getMatchScore: (userId: string, teamId: string) =>
    fetchAPI('/ai/match-score', {
      method: 'POST',
      body: JSON.stringify({ userId, teamId }),
    }),

  generateCoachingReport: (gameId: string) =>
    fetchAPI('/ai/coaching-report', {
      method: 'POST',
      body: JSON.stringify({ gameId }),
    }),

  getRecommendedTeams: (userId: string) =>
    fetchAPI(`/ai/recommend-teams?userId=${userId}`),
};
