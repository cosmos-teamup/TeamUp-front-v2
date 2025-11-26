import type { Court, NearbyTeam } from '@/types';

// API 클라이언트 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

// Mock 데이터 (백엔드 완성 전까지 사용)

const mockCourts: Court[] = [
  {
    id: '1',
    name: '광진 농구장',
    address: '서울 광진구 능동로 123',
    type: '실외',
    lat: 37.5465,
    lng: 127.0735,
    distance: 0.3
  },
  {
    id: '2',
    name: '워커힐 체육관',
    address: '서울 광진구 워커힐로 177',
    type: '실내',
    lat: 37.5545,
    lng: 127.1135,
    distance: 0.8
  },
  {
    id: '3',
    name: '능동 체육공원',
    address: '서울 광진구 능동로 216',
    type: '실외',
    lat: 37.5485,
    lng: 127.0785,
    distance: 1.2
  },
];

const mockNearbyTeams: NearbyTeam[] = [
  {
    id: '1',
    name: '세종 born_9',
    date: '5월 11일',
    time: '오후 6시',
    location: '광진구 능동로',
    level: 'A',
    isOfficial: true,
    members: 5,
    maxMembers: 5,
    lat: 37.5465,
    lng: 127.0735,
    distance: 0.3
  },
  {
    id: '2',
    name: '세종 born_10',
    date: '5월 12일',
    time: '오후 7시',
    location: '광진구 능동로',
    level: 'A+',
    isOfficial: false,
    members: 3,
    maxMembers: 5,
    lat: 37.5470,
    lng: 127.0740,
    distance: 0.4
  },
  {
    id: '3',
    name: '세종 born_11',
    date: '5월 13일',
    time: '오후 8시',
    location: '광진구 능동로',
    level: 'A-',
    isOfficial: true,
    members: 5,
    maxMembers: 5,
    lat: 37.5475,
    lng: 127.0745,
    distance: 0.5
  },
  {
    id: '4',
    name: '광진 Thunder',
    date: '5월 14일',
    time: '오후 5시',
    location: '광진구 자양동',
    level: 'B+',
    isOfficial: true,
    members: 5,
    maxMembers: 5,
    lat: 37.5345,
    lng: 127.0685,
    distance: 1.8
  },
  {
    id: '5',
    name: '능동 Warriors',
    date: '5월 15일',
    time: '오후 6시 30분',
    location: '광진구 능동로',
    level: 'A',
    isOfficial: false,
    members: 4,
    maxMembers: 5,
    lat: 37.5480,
    lng: 127.0750,
    distance: 0.6
  },
];

// API 함수들 (백엔드 연동 시 사용)
export const api = {
  // Team APIs
  getTeam: (id: string) => fetchAPI(`/teams/${id}`),
  getMyTeam: () => fetchAPI('/teams/my'),

  // Matching APIs
  getMatches: () => fetchAPI('/matches'),
  createMatch: (data: any) => fetchAPI('/matches', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // User APIs
  getUser: (id: string) => fetchAPI(`/users/${id}`),
  getMe: () => fetchAPI('/users/me'),

  // Map APIs (백엔드 준비되면 실제 API로 교체)
  map: {
    // 주변 농구장 가져오기 (거리순 정렬, 가까운 2개만)
    getNearbyCourts: async (lat: number, lng: number): Promise<Court[]> => {
      // TODO: 백엔드 API 연동
      // return fetchAPI(`/courts/nearby?lat=${lat}&lng=${lng}&limit=2`);

      // 현재: Mock 데이터 반환 (거리순 정렬, 2개만)
      await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션
      return mockCourts.slice(0, 2);
    },

    // 주변 팀 가져오기 (같은 지역 1개만 표시)
    getNearbyTeams: async (lat: number, lng: number): Promise<NearbyTeam[]> => {
      // TODO: 백엔드 API 연동
      // return fetchAPI(`/teams/nearby?lat=${lat}&lng=${lng}`);

      // 현재: Mock 데이터 반환 (같은 지역 1개만)
      await new Promise(resolve => setTimeout(resolve, 300));

      // 같은 location끼리 그룹핑 (프론트 임시 로직, 나중에 백엔드에서 처리)
      const grouped = mockNearbyTeams.reduce((acc, team) => {
        if (!acc[team.location]) {
          acc[team.location] = team; // 첫 번째 팀만 저장
        }
        return acc;
      }, {} as Record<string, NearbyTeam>);

      return Object.values(grouped).slice(0, 1);
    },

    // 전체 팀 목록 (전체보기)
    getAllNearbyTeams: async (lat: number, lng: number): Promise<NearbyTeam[]> => {
      // TODO: 백엔드 API 연동
      // return fetchAPI(`/teams/nearby?lat=${lat}&lng=${lng}&all=true`);

      // 현재: Mock 데이터 전체 반환
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockNearbyTeams;
    },
  },
};
