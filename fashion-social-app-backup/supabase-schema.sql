-- Fashion Social App Database Schema
-- Create tables for the fashion social app

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  style_preferences TEXT[],
  privacy_settings JSONB DEFAULT '{
    "profile_visibility": "public",
    "show_email": false,
    "show_phone": false,
    "allow_tagging": true,
    "wardrobe_backup": "cloud_sync",
    "location_sharing": false,
    "data_analytics": true
  }'::jsonb,
  points_balance INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  is_moderator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  images TEXT[] NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  mentions TEXT[] DEFAULT '{}',
  location TEXT,
  outfit_items UUID[] DEFAULT '{}',
  competition_id UUID REFERENCES competitions(id),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  hearts_count INTEGER DEFAULT 0,
  is_reported BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_reported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wardrobes table
CREATE TABLE IF NOT EXISTS wardrobes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  access_code TEXT UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  items_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wardrobe items table
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wardrobe_id UUID NOT NULL REFERENCES wardrobes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'outerwear', 'shoes', 'accessories', 'innerwear', 'bags', 'hats', 'jewelry', 'other')),
  subcategory TEXT,
  brand TEXT,
  color TEXT,
  size TEXT,
  material TEXT,
  purchase_date DATE,
  price DECIMAL(10,2),
  image_url TEXT NOT NULL,
  ai_tags TEXT[] DEFAULT '{}',
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  times_worn INTEGER DEFAULT 0,
  last_worn DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily_theme', 'brand_collab', 'weekly_challenge')),
  hashtag TEXT NOT NULL,
  banner_image TEXT,
  sponsor TEXT,
  prize_description TEXT,
  rules TEXT[] DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'judging', 'completed', 'cancelled')),
  entries_count INTEGER DEFAULT 0,
  max_entries_per_user INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competition entries table
CREATE TABLE IF NOT EXISTS competition_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hearts_count INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT FALSE,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competition_entry_id UUID NOT NULL REFERENCES competition_entries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, competition_entry_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'competition_update', 'daily_outfit', 'points_earned', 'badge_unlocked', 'mention', 'share')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Points transactions table
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('share', 'referral', 'daily_login', 'competition_entry', 'competition_win', 'bonus', 'deduction')),
  description TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  unlock_condition TEXT NOT NULL,
  points_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Shared wardrobes table
CREATE TABLE IF NOT EXISTS shared_wardrobes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wardrobe_id UUID NOT NULL REFERENCES wardrobes(id) ON DELETE CASCADE,
  access_code TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0,
  max_access INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_type TEXT NOT NULL CHECK (reported_type IN ('post', 'user', 'comment')),
  reported_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate_content', 'harassment', 'copyright', 'impersonation', 'false_information', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather data table
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  temperature DECIMAL(5,2) NOT NULL,
  condition TEXT NOT NULL,
  humidity INTEGER,
  wind_speed DECIMAL(5,2),
  icon TEXT,
  feels_like DECIMAL(5,2),
  uv_index INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outfit suggestions table
CREATE TABLE IF NOT EXISTS outfit_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weather_data_id UUID NOT NULL REFERENCES weather_data(id) ON DELETE CASCADE,
  items UUID[] NOT NULL,
  styling_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_feedback TEXT CHECK (user_feedback IN ('loved', 'not_for_me'))
);

-- AR sessions table
CREATE TABLE IF NOT EXISTS ar_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  base_image TEXT NOT NULL,
  outfit_items UUID[] DEFAULT '{}',
  transformations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_competition_id ON posts(competition_id);
CREATE INDEX IF NOT EXISTS idx_wardrobes_user_id ON wardrobes(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_wardrobe_id ON wardrobe_items(wardrobe_id);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_dates ON competitions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_competition_entries_competition_id ON competition_entries(competition_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);

-- Create functions for updating counts
CREATE OR REPLACE FUNCTION increment_likes_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_hearts_count(entry_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE competition_entries SET hearts_count = hearts_count + 1 WHERE id = entry_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_points_balance(user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users SET points_balance = points_balance + amount WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_wardrobe_items_count(wardrobe_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE wardrobes SET items_count = items_count + 1 WHERE id = wardrobe_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_competition_entries_count(competition_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE competitions SET entries_count = entries_count + 1 WHERE id = competition_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wardrobes_updated_at BEFORE UPDATE ON wardrobes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wardrobe_items_updated_at BEFORE UPDATE ON wardrobe_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competitions_updated_at BEFORE UPDATE ON competitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ar_sessions_updated_at BEFORE UPDATE ON ar_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default badges
INSERT INTO badges (name, description, icon_url, unlock_condition, points_reward) VALUES
('First Post', 'Share your first outfit', '📸', 'Create first post', 50),
('Style Star', 'Get 100 likes on a single post', '⭐', 'Post reaches 100 likes', 100),
('Competition Winner', 'Win a fashion competition', '🏆', 'Win any competition', 500),
('Trendsetter', 'Have 10 followers', '👑', 'Reach 10 followers', 200),
('Fashion Guru', 'Post 50 outfits', '👗', 'Create 50 posts', 300),
('Early Bird', 'Login 7 days in a row', '🌅', '7 day login streak', 100),
('Social Butterfly', 'Like 100 posts', '🦋', 'Like 100 posts', 50),
('Wardrobe Expert', 'Add 100 items to wardrobe', '👔', '100 wardrobe items', 150)
ON CONFLICT DO NOTHING;