export interface DbMessage {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  message: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
}