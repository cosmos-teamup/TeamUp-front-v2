'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

interface KakaoMapProps {
  lat: number
  lng: number
  markers?: Array<{
    lat: number
    lng: number
    title: string
  }>
  className?: string
}

export default function KakaoMap({ lat, lng, markers = [], className = '' }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao Maps API가 로드되지 않았습니다.')
        return
      }

      if (!mapRef.current) return

      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3, // 지도 확대 레벨
      }

      const map = new window.kakao.maps.Map(mapRef.current, options)

      // 현재 위치 마커
      const markerPosition = new window.kakao.maps.LatLng(lat, lng)
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map,
      })

      // 추가 마커들 (농구장, 팀 등)
      markers.forEach((markerData) => {
        const position = new window.kakao.maps.LatLng(markerData.lat, markerData.lng)
        const customMarker = new window.kakao.maps.Marker({
          position: position,
          map: map,
          title: markerData.title,
        })
      })
    }

    // Kakao Maps API 스크립트 로드
    if (!document.getElementById('kakao-map-script')) {
      const script = document.createElement('script')
      script.id = 'kakao-map-script'
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(loadKakaoMap)
      }
      document.head.appendChild(script)
    } else {
      if (window.kakao && window.kakao.maps) {
        loadKakaoMap()
      }
    }
  }, [lat, lng, markers])

  return <div ref={mapRef} className={`w-full h-full ${className}`} />
}
