export interface Notification {
  id: number;
  user_id: number;
  title_jp: string;
  content_jp: string;
  is_read: boolean;
  is_starred: boolean;
  created_at: string;
}
