import { createContext, useContext } from "react";

export type Notification = {
  title: string;
  content: string;
};

type NotificationContext = {
  publishNotification: (notification: Notification) => void;
};

export const NotificationsContext = createContext<NotificationContext>({
  publishNotification: () => {},
});

export function useNotifications() {
  return useContext(NotificationsContext);
}
