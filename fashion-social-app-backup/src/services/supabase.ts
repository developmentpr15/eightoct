import { createClient } from '@supabase/supabase-js';
import ENV from '../constants/env';
import type { 
  User, 
  Post, 
  Wardrobe, 
  WardrobeItem, 
  Competition, 
  CompetitionEntry,
  Follow,
  Comment,
  Notification,
  PointsTransaction,
  Badge,
  UserBadge,
  ApiResponse,
  PaginatedResponse
} from '../types';

class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
  }

  // Auth Methods
  async signUp(email: string, password: string, metadata: any) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async signInWithGoogle() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'fashionsocial://auth/callback'
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // User Methods
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Post Methods
  async getPosts(limit: number = 20, cursor?: string): Promise<PaginatedResponse<Post>> {
    try {
      let query = this.supabase
        .from('posts')
        .select(`
          *,
          user:users(id, username, full_name, avatar_url, is_verified)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (cursor) {
        query = query.lt('created_at', cursor);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return {
        data: data || [],
        count: data?.length || 0,
        has_more: data?.length === limit,
        next_cursor: data?.length > 0 ? data[data.length - 1].created_at : undefined
      };
    } catch (error) {
      return {
        data: [],
        count: 0,
        has_more: false,
        error: error.message
      };
    }
  }

  async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'shares_count' | 'hearts_count'>): Promise<ApiResponse<Post>> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .insert({
          ...post,
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
          hearts_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async likePost(postId: string, userId: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await this.supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId });

      if (error) throw error;

      // Update likes count
      await this.supabase.rpc('increment_likes_count', { post_id: postId });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async unlikePost(postId: string, userId: string): Promise<ApiResponse<any>> {
    try {
      const { error } = await this.supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update likes count
      await this.supabase.rpc('decrement_likes_count', { post_id: postId });

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Wardrobe Methods
  async getWardrobes(userId: string): Promise<ApiResponse<Wardrobe[]>> {
    try {
      const { data, error } = await this.supabase
        .from('wardrobes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async createWardrobe(wardrobe: Omit<Wardrobe, 'id' | 'created_at' | 'updated_at' | 'items_count'>): Promise<ApiResponse<Wardrobe>> {
    try {
      const { data, error } = await this.supabase
        .from('wardrobes')
        .insert({
          ...wardrobe,
          items_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async getWardrobeItems(wardrobeId: string): Promise<ApiResponse<WardrobeItem[]>> {
    try {
      const { data, error } = await this.supabase
        .from('wardrobe_items')
        .select('*')
        .eq('wardrobe_id', wardrobeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async addWardrobeItem(item: Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at' | 'times_worn' | 'last_worn'>): Promise<ApiResponse<WardrobeItem>> {
    try {
      const { data, error } = await this.supabase
        .from('wardrobe_items')
        .insert({
          ...item,
          times_worn: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Update wardrobe items count
      await this.supabase.rpc('increment_wardrobe_items_count', { wardrobe_id: item.wardrobe_id });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Competition Methods
  async getCompetitions(): Promise<ApiResponse<Competition[]>> {
    try {
      const { data, error } = await this.supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async getCompetitionEntries(competitionId: string): Promise<ApiResponse<CompetitionEntry[]>> {
    try {
      const { data, error } = await this.supabase
        .from('competition_entries')
        .select(`
          *,
          post:posts(*, user:users(id, username, full_name, avatar_url)),
          user:users(id, username, full_name, avatar_url)
        `)
        .eq('competition_id', competitionId)
        .order('hearts_count', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async enterCompetition(entry: Omit<CompetitionEntry, 'id' | 'created_at' | 'hearts_count' | 'is_winner' | 'rank'>): Promise<ApiResponse<CompetitionEntry>> {
    try {
      const { data, error } = await this.supabase
        .from('competition_entries')
        .insert({
          ...entry,
          hearts_count: 0,
          is_winner: false
        })
        .select()
        .single();

      if (error) throw error;

      // Update competition entries count
      await this.supabase.rpc('increment_competition_entries_count', { competition_id: entry.competition_id });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async voteForEntry(entryId: string, userId: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await this.supabase
        .from('votes')
        .insert({ competition_entry_id: entryId, user_id: userId });

      if (error) throw error;

      // Update hearts count
      await this.supabase.rpc('increment_hearts_count', { entry_id: entryId });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Follow Methods
  async followUser(followerId: string, followingId: string): Promise<ApiResponse<Follow>> {
    try {
      const { data, error } = await this.supabase
        .from('follows')
        .insert({ follower_id: followerId, following_id: followingId })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async unfollowUser(followerId: string, followingId: string): Promise<ApiResponse<any>> {
    try {
      const { error } = await this.supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async getFollowers(userId: string): Promise<ApiResponse<User[]>> {
    try {
      const { data, error } = await this.supabase
        .from('follows')
        .select(`
          follower:users(id, username, full_name, avatar_url, is_verified)
        `)
        .eq('following_id', userId);

      if (error) throw error;
      return { data: data?.map(f => f.follower) || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async getFollowing(userId: string): Promise<ApiResponse<User[]>> {
    try {
      const { data, error } = await this.supabase
        .from('follows')
        .select(`
          following:users(id, username, full_name, avatar_url, is_verified)
        `)
        .eq('follower_id', userId);

      if (error) throw error;
      return { data: data?.map(f => f.following) || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  // Notification Methods
  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<any>> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Points Methods
  async addPointsTransaction(transaction: Omit<PointsTransaction, 'id' | 'created_at'>): Promise<ApiResponse<PointsTransaction>> {
    try {
      const { data, error } = await this.supabase
        .from('points_transactions')
        .insert(transaction)
        .select()
        .single();

      if (error) throw error;

      // Update user points balance
      await this.supabase.rpc('update_user_points_balance', { 
        user_id: transaction.user_id, 
        amount: transaction.amount 
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async getUserPointsTransactions(userId: string): Promise<ApiResponse<PointsTransaction[]>> {
    try {
      const { data, error } = await this.supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }
}

export default new SupabaseService();