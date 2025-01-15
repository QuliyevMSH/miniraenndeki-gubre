export interface Media {
  id: number;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  user_id: string;
  created_at: string;
  user?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}