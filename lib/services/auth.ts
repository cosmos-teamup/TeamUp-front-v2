// 인증 관련 API
import { fetchText, post, setAccessToken, removeAccessToken } from './client'

export interface RegisterRequest {
  email: string
  nickname: string
  mainPosition: string
  subPosition?: string
  gender: string
  age: number
  address: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    nickname: string
  }
}

export const authService = {
  // 이메일 인증코드 요청
  requestEmailVerification: async (email: string): Promise<string> => {
    return fetchText('/email/verify/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // 이메일 인증코드 확인
  confirmEmailVerification: async (
    email: string,
    code: string
  ): Promise<string> => {
    return fetchText('/email/verify/confirm', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await post<LoginResponse>('/auth/register', data)

    // 회원가입 성공 시 토큰 저장
    if (response.accessToken) {
      setAccessToken(response.accessToken)
    }

    return response
  },

  // 로그아웃
  logout: (): void => {
    removeAccessToken()
    // localStorage의 다른 데이터도 필요시 정리
  },
}
