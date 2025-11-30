'use client'

import { Map, MapMarker } from 'react-kakao-maps-sdk'
import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import useKakaoLoader from '@/hooks/useKakaoLoader'

interface KakaoMapProps {
  className?: string
}

export default function KakaoMap({ className = '' }: KakaoMapProps) {
  useKakaoLoader()

  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoading(false)
        },
        () => {
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setIsLoading(false)
    }
  }, [])

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-muted/30`}>
        <div className="text-center space-y-2">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" />
          <p className="text-sm text-muted-foreground">위치 정보 확인 중...</p>
        </div>
      </div>
    )
  }

  // 로딩 완료 후 지도 표시
  return (
    <div className={className}>
      <Map
        center={center}
        style={{ width: '100%', height: '100%' }}
        level={4}
      >
        <MapMarker position={center} />
      </Map>
    </div>
  )
}
