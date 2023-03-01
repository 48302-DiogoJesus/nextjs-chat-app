"use client"

import { useState } from "react"
import uuid from "react-uuid"
import { Notification, NotificationsContext } from "./NotificationCtx"

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> =
  ({ children }) => {
    const [notifications, setNotifications] = useState<{ id: string, notification: Notification }[]>([])

    return (
      <NotificationsContext.Provider value={{
        publishNotification(notification) {
          const newNotificationId = uuid()

          setNotifications(prev => [...prev, {
            id: newNotificationId,
            notification: notification,
          }])

          // Remove this notification after 6 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotificationId))
          }, 6000)
        },
      }}>
        <div className="toast toast-start toast-top top-20">
          {
            notifications.map(({ id, notification }) => (
              <div key={id} className="alert alert-success">
                <div className="flex flex-col items-start justify-center">
                  <span className="font-bold text-lg">{notification.title}</span>
                  <span>{notification.content}</span>
                </div>
              </div>
            ))
          }
        </div>
        {children}
      </NotificationsContext.Provider>
    )
  }