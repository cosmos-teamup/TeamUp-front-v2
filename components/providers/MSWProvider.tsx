'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    // MSW는 개발 환경에서만 활성화
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      const initMsw = async () => {
        const { worker } = await import('@/mocks/browser')
        await worker.start({
          onUnhandledRequest: 'bypass', // MSW가 처리하지 않는 요청은 그대로 통과
        })
        setMswReady(true)
      }
      initMsw()
    } else {
      // MSW를 사용하지 않으면 바로 준비 완료
      setMswReady(true)
    }
  }, [])

  // MSW가 준비될 때까지 로딩 (개발 환경에서만)
  if (!mswReady && process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    return null
  }

  return <>{children}</>
}

