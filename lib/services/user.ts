// 유저 관련 API
import { get, del } from './client'

export interface User {
  id: string
  email: string
  nickname: string
  mainPosition: string
  subPosition?: string
  gender: string
  age: number
  address: string
  height?: number
  playStyle?: string
  statusMsg?: string
  team?: unknown
}

export const userService = {
  // 내 정보 조회
  getMe: async (): Promise<User> => {
    return get<User>('/users/me')
  },

  // 특정 유저 조회
  getUser: async (id: string): Promise<User> => {
    return get<User>(`/users/${id}`)
  },

  // 이메일로 유저 조회
  getUserByEmail: async (email: string): Promise<User> => {
    return get<User>(`/user?email=${email}`)
  },

  // 전체 유저 조회 (개발용)
  getAllUsers: async (): Promise<User[]> => {
    return get<User[]>('/user/all')
  },

  // 이메일로 유저 삭제 (개발용)
  deleteUserByEmail: async (email: string): Promise<void> => {
    return del(`/user/by-email?email=${email}`)
  },
}
