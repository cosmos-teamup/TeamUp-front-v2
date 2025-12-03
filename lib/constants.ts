// App Constants
export const APP_NAME = 'TeamUp';
export const APP_DESCRIPTION = 'AI 기반 농구 팀 매칭 & 코칭 플랫폼';

// Routes
export const ROUTES = {
  HOME: '/',
  MATCHING: '/matching',
  MATCHING_CREATE: '/matching/create',
  MAP: '/map',
  MYPAGE: '/mypage',
  TEAM: '/team',
  COACHING: '/coaching',
} as const;

// Team Levels
export const TEAM_LEVELS = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
} as const;

// 서울특별시 행정구역 데이터
export const SEOUL_DISTRICTS = {
  강남구: ['역삼동', '논현동', '압구정동', '청담동', '삼성동', '대치동', '신사동', '도곡동'],
  강동구: ['천호동', '성내동', '길동', '둔촌동', '암사동', '고덕동', '상일동'],
  강북구: ['미아동', '번동', '수유동', '우이동'],
  강서구: ['염창동', '등촌동', '화곡동', '가양동', '마곡동', '발산동', '공항동'],
  관악구: ['봉천동', '신림동', '남현동'],
  광진구: ['중곡동', '능동', '구의동', '광장동', '자양동', '화양동'],
  구로구: ['신도림동', '구로동', '가리봉동', '고척동', '개봉동', '오류동'],
  금천구: ['가산동', '독산동', '시흥동'],
  노원구: ['월계동', '공릉동', '하계동', '상계동', '중계동'],
  도봉구: ['쌍문동', '방학동', '창동', '도봉동'],
  동대문구: ['용두동', '제기동', '전농동', '답십리동', '장안동', '청량리동', '회기동', '휘경동'],
  동작구: ['노량진동', '상도동', '흑석동', '사당동', '대방동', '신대방동'],
  마포구: ['공덕동', '아현동', '도화동', '용강동', '대흥동', '염리동', '신수동', '서강동', '서교동', '합정동', '망원동', '연남동', '성산동', '상암동'],
  서대문구: ['충정로', '천연동', '신촌동', '연희동', '홍제동', '북아현동', '북가좌동', '남가좌동'],
  서초구: ['서초동', '잠원동', '반포동', '방배동', '양재동', '내곡동'],
  성동구: ['왕십리', '마장동', '사근동', '행당동', '응봉동', '금호동', '옥수동', '성수동'],
  성북구: ['성북동', '삼선동', '동선동', '돈암동', '안암동', '보문동', '정릉동', '길음동', '종암동', '월곡동', '장위동', '석관동'],
  송파구: ['풍납동', '거여동', '마천동', '방이동', '오금동', '송파동', '석촌동', '삼전동', '가락동', '문정동', '장지동', '잠실동'],
  양천구: ['신정동', '목동', '신월동'],
  영등포구: ['영등포동', '여의도동', '당산동', '도림동', '문래동', '양평동', '신길동', '대림동'],
  용산구: ['후암동', '용산동', '남영동', '청파동', '원효로', '효창동', '이촌동', '이태원동', '한강로동', '서빙고동', '보광동'],
  은평구: ['수색동', '녹번동', '불광동', '갈현동', '구산동', '대조동', '응암동', '역촌동', '신사동', '증산동'],
  종로구: ['청운동', '사직동', '삼청동', '부암동', '평창동', '무악동', '교남동', '가회동', '종로1가', '종로2가', '혜화동', '이화동'],
  중구: ['소공동', '회현동', '명동', '필동', '장충동', '광희동', '을지로', '신당동', '다산동', '약수동', '청구동', '황학동', '중림동'],
  중랑구: ['면목동', '상봉동', '중화동', '묵동', '망우동', '신내동']
} as const

export type DistrictName = keyof typeof SEOUL_DISTRICTS
export type DongName = typeof SEOUL_DISTRICTS[DistrictName][number]

// 구 목록 (선택용)
export const DISTRICT_LIST = Object.keys(SEOUL_DISTRICTS) as DistrictName[]

// 활동 지역 포맷팅
export function formatRegion(district: DistrictName, dong?: string): string {
  return dong ? `${district} ${dong}` : district
}

// 포지션별 색상 시스템 (플레이어 카드, 농구 코트, 모달 등에서 공통 사용)
export const POSITION_COLORS = {
  1: { // PG (Point Guard)
    name: '포인트 가드',
    shortName: 'PG',
    text: 'text-blue-500',
    border: 'border-blue-500',
    bg: 'bg-blue-500',
    bgGradient: 'from-blue-600 to-blue-800',
    bgLight: 'bg-blue-50',
    bgLightDark: 'bg-blue-100',
    hover: 'hover:bg-blue-600',
    shadow: 'shadow-blue-500/50',
    ring: 'ring-blue-500',
    hex: '#3b82f6',
  },
  2: { // SG (Shooting Guard)
    name: '슈팅 가드',
    shortName: 'SG',
    text: 'text-cyan-500',
    border: 'border-cyan-500',
    bg: 'bg-cyan-500',
    bgGradient: 'from-cyan-600 to-cyan-800',
    bgLight: 'bg-cyan-50',
    bgLightDark: 'bg-cyan-100',
    hover: 'hover:bg-cyan-600',
    shadow: 'shadow-cyan-500/50',
    ring: 'ring-cyan-500',
    hex: '#06b6d4',
  },
  3: { // SF (Small Forward)
    name: '스몰 포워드',
    shortName: 'SF',
    text: 'text-green-500',
    border: 'border-green-500',
    bg: 'bg-green-500',
    bgGradient: 'from-green-600 to-green-800',
    bgLight: 'bg-green-50',
    bgLightDark: 'bg-green-100',
    hover: 'hover:bg-green-600',
    shadow: 'shadow-green-500/50',
    ring: 'ring-green-500',
    hex: '#22c55e',
  },
  4: { // PF (Power Forward)
    name: '파워 포워드',
    shortName: 'PF',
    text: 'text-orange-500',
    border: 'border-orange-500',
    bg: 'bg-orange-500',
    bgGradient: 'from-orange-600 to-orange-800',
    bgLight: 'bg-orange-50',
    bgLightDark: 'bg-orange-100',
    hover: 'hover:bg-orange-600',
    shadow: 'shadow-orange-500/50',
    ring: 'ring-orange-500',
    hex: '#f97316',
  },
  5: { // C (Center)
    name: '센터',
    shortName: 'C',
    text: 'text-purple-500',
    border: 'border-purple-500',
    bg: 'bg-purple-500',
    bgGradient: 'from-purple-600 to-purple-800',
    bgLight: 'bg-purple-50',
    bgLightDark: 'bg-purple-100',
    hover: 'hover:bg-purple-600',
    shadow: 'shadow-purple-500/50',
    ring: 'ring-purple-500',
    hex: '#a855f7',
  },
} as const

export type PositionId = keyof typeof POSITION_COLORS
