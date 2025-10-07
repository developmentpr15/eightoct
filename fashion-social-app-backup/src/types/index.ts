// Core types for Fashion Social App

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  style_preferences?: string[];
  privacy_settings: PrivacySettings;
  points_balance: number;
  referral_code: string;
  referred_by?: string;
  is_verified: boolean;
  is_moderator: boolean;
  posts_count?: number;
  followers_count?: number;
  following_count?: number;
  created_at: string;
  updated_at: string;
  last_login: string;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  show_email: boolean;
  show_phone: boolean;
  allow_tagging: boolean;
  wardrobe_backup: 'local_only' | 'cloud_sync';
  location_sharing: boolean;
  data_analytics: boolean;
}

export interface Post {
  id: string;
  user_id: string;
  caption: string;
  images: string[];
  hashtags: string[];
  mentions: string[];
  location?: string;
  outfit_items?: string[];
  competition_id?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  hearts_count: number;
  is_reported: boolean;
  is_hidden: boolean;
  is_liked?: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Wardrobe {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  access_code?: string;
  expires_at?: string;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface WardrobeItem {
  id: string;
  wardrobe_id: string;
  name: string;
  category: ClothingCategory;
  subcategory?: string;
  brand?: string;
  color?: string;
  size?: string;
  material?: string;
  purchase_date?: string;
  price?: number;
  image_url: string;
  ai_tags: string[];
  notes?: string;
  is_favorite: boolean;
  times_worn: number;
  last_worn?: string;
  created_at: string;
  updated_at: string;
}

export type ClothingCategory = 
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'innerwear'
  | 'bags'
  | 'hats'
  | 'jewelry'
  | 'other';

export interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'daily_theme' | 'brand_collab' | 'weekly_challenge';
  hashtag: string;
  banner_image?: string;
  sponsor?: string;
  prize_description?: string;
  rules: string[];
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'judging' | 'completed' | 'cancelled';
  entries_count: number;
  max_entries_per_user?: number;
  created_at: string;
  updated_at: string;
}

export interface CompetitionEntry {
  id: string;
  competition_id: string;
  post_id: string;
  user_id: string;
  hearts_count: number;
  is_winner: boolean;
  rank?: number;
  created_at: string;
  post?: Post;
  user?: User;
}

export interface Vote {
  id: string;
  user_id: string;
  competition_entry_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  likes_count: number;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export type NotificationType = 
  | 'like'
  | 'comment'
  | 'follow'
  | 'competition_update'
  | 'daily_outfit'
  | 'points_earned'
  | 'badge_unlocked'
  | 'mention'
  | 'share';

export interface PointsTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: PointsTransactionType;
  description: string;
  reference_id?: string;
  created_at: string;
}

export type PointsTransactionType = 
  | 'share'
  | 'referral'
  | 'daily_login'
  | 'competition_entry'
  | 'competition_win'
  | 'bonus'
  | 'deduction';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  unlock_condition: string;
  points_reward: number;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  badge?: Badge;
}

export interface SharedWardrobe {
  id: string;
  wardrobe_id: string;
  access_code: string;
  created_by: string;
  expires_at?: string;
  access_count: number;
  max_access?: number;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_type: 'post' | 'user' | 'comment';
  reported_id: string;
  reason: ReportReason;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
}

export type ReportReason = 
  | 'spam'
  | 'inappropriate_content'
  | 'harassment'
  | 'copyright'
  | 'impersonation'
  | 'false_information'
  | 'other';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
  icon: string;
  feels_like: number;
  uv_index: number;
  timestamp: string;
}

export interface OutfitSuggestion {
  id: string;
  user_id: string;
  weather_data: WeatherData;
  items: WardrobeItem[];
  styling_tips: string;
  created_at: string;
  user_feedback?: 'loved' | 'not_for_me';
}

export interface ARSession {
  id: string;
  user_id: string;
  base_image: string;
  outfit_items: string[];
  transformations: ARTransform[];
  created_at: string;
  updated_at: string;
}

export interface ARTransform {
  item_id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  has_more: boolean;
  next_cursor?: string;
}

// Navigation types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
  Main: undefined;
  Profile: { userId?: string };
  Post: { postId: string };
  Competition: { competitionId: string };
  Wardrobe: { wardrobeId?: string };
  AR: { baseImage?: string };
  Settings: undefined;
  Notifications: undefined;
  Search: { query?: string };
  Camera: { mode: 'post' | 'wardrobe' };
};

export type MainTabParamList = {
  Feed: undefined;
  Wardrobe: undefined;
  Competitions: undefined;
  Profile: undefined;
};