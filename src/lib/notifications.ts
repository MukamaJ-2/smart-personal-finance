export type NotificationType = "anomaly";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
}

const NOTIFICATIONS_KEY = "uniguard.notifications";
const NOTIFIED_EMAIL_KEY = "uniguard.notifications.sent";
const USER_EMAIL_KEY = "uniguard.user.email";

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_EMAIL_KEY);
}

export function setUserEmail(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_EMAIL_KEY, email);
}

export function getNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return [];
  }
}

export function addNotification(notification: AppNotification) {
  if (typeof window === "undefined") return;
  const existing = getNotifications();
  const deduped = existing.some((item) => item.id === notification.id)
    ? existing
    : [notification, ...existing];
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(deduped.slice(0, 100)));
}

export function wasEmailSent(notificationId: string) {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(NOTIFIED_EMAIL_KEY);
  if (!raw) return false;
  try {
    const sent = JSON.parse(raw) as string[];
    return sent.includes(notificationId);
  } catch {
    return false;
  }
}

export function markEmailSent(notificationId: string) {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(NOTIFIED_EMAIL_KEY);
  const sent = raw ? (JSON.parse(raw) as string[]) : [];
  if (!sent.includes(notificationId)) {
    sent.push(notificationId);
    window.localStorage.setItem(NOTIFIED_EMAIL_KEY, JSON.stringify(sent.slice(-200)));
  }
}
