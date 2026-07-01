import { useEffect, useRef } from 'react'

export const useAutoRefresh = (callback, interval = 5000) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (typeof callback !== 'function') return
    if (!Number.isFinite(interval) || interval <= 0) return

    let isActive = true
    const timer = window.setInterval(() => {
      if (!isActive) return
      savedCallback.current()
    }, interval)

    return () => {
      isActive = false
      window.clearInterval(timer)
    }
  }, [callback, interval])
}
