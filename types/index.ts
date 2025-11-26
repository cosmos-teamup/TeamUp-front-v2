// Team Types
export interface Team {
  id: string;
  name: string;
  shortName: string;
  memberCount: number;
  level: 'A' | 'B' | 'C' | 'D';
  totalGames: number;
  aiReports: number;
  activeDays: number;
  logo?: string;
}

// AI Coaching Types
export interface AICoaching {
  id: string;
  date: string;
  matchTitle: string;
  opponent: string;
  result: 'win' | 'lose' | 'draw';
  strength: string;
  improvement: string;
}

// Activity Types
export interface Activity {
  id: string;
  type: 'message' | 'match' | 'report' | 'member';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  teamId?: string;
}

// Map Types
export interface Court {
  id: string;
  name: string;
  address: string;
  type: '실내' | '실외';
  lat: number;
  lng: number;
  distance?: number; // 사용자로부터의 거리 (km)
}

export interface NearbyTeam {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string; // "광진구 능동로"
  level: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D';
  isOfficial: boolean; // 정식 팀 여부
  members: number;
  maxMembers: number;
  lat?: number;
  lng?: number;
  distance?: number; // 사용자로부터의 거리 (km)
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}
