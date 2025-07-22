export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}