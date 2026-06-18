import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

/**
 * useRealtimeSync Hook
 * 
 * Subscribes to real-time changes from Supabase and updates component state.
 * Automatically handles subscription cleanup on unmount.
 * 
 * Usage:
 * const { data, isLoading, error, refetch } = useRealtimeSync({
 *   table: 'products',
 *   event: '*',  // 'INSERT', 'UPDATE', 'DELETE', or '*'
 *   onInsert: (payload) => {},
 *   onUpdate: (payload) => {},
 *   onDelete: (payload) => {},
 * })
 */
export const useRealtimeSync = ({
  table,
  event = '*',
  onInsert,
  onUpdate,
  onDelete,
  showToast = true,
}) => {
  useEffect(() => {
    if (!table) return

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && onInsert) {
            onInsert(payload)
            if (showToast) {
              toast.success(`New ${table} added`, { duration: 2000 })
            }
          }

          if (payload.eventType === 'UPDATE' && onUpdate) {
            onUpdate(payload)
            if (showToast) {
              toast.success(`${table} updated`, { duration: 2000 })
            }
          }

          if (payload.eventType === 'DELETE' && onDelete) {
            onDelete(payload)
            if (showToast) {
              toast.error(`${table} deleted`, { duration: 2000 })
            }
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [table, event, onInsert, onUpdate, onDelete, showToast])
}

/**
 * Broadcast real-time event to all subscribed clients
 * Useful for notifying users about admin actions
 */
export const broadcastUpdate = async (channel, message) => {
  const { error } = await supabase.channel(channel).send({
    type: 'broadcast',
    event: 'update',
    payload: message,
  })
  if (error) console.error('Broadcast error:', error)
}

/**
 * Subscribe to broadcast messages
 */
export const subscribeToBroadcast = (channel, callback) => {
  const subscription = supabase
    .channel(channel)
    .on('broadcast', { event: 'update' }, (payload) => {
      callback(payload)
    })
    .subscribe()

  return subscription
}
