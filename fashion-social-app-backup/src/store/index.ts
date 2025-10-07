import { create } from 'zustand';
import type { User, Post, Wardrobe, WardrobeItem, Competition, Notification } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

interface FeedState {
  posts: (Post & { is_liked?: boolean })[];
  isLoading: boolean;
  hasMore: boolean;
  cursor?: string;
  fetchPosts: (refresh?: boolean) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'shares_count' | 'hearts_count'>) => Promise<void>;
}

interface WardrobeState {
  wardrobes: Wardrobe[];
  items: WardrobeItem[];
  selectedWardrobe: Wardrobe | null;
  isLoading: boolean;
  fetchWardrobes: () => Promise<void>;
  fetchItems: (wardrobeId: string) => Promise<void>;
  createWardrobe: (wardrobe: Omit<Wardrobe, 'id' | 'created_at' | 'updated_at' | 'items_count'>) => Promise<void>;
  selectWardrobe: (wardrobe: Wardrobe) => void;
}

interface CompetitionState {
  competitions: Competition[];
  isLoading: boolean;
  fetchCompetitions: () => Promise<void>;
  enterCompetition: (competitionId: string) => Promise<void>;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}

// Auth Store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const supabase = await import('../services/supabase');
      const { data, error } = await supabase.default.signIn(email, password);
      
      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      // Get user profile
      const { data: profile } = await supabase.default.getUserProfile(data.user?.id || '');
      
      set({ 
        user: profile.data, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ isLoading: true });
      const supabase = await import('../services/supabase');
      const { data, error } = await supabase.default.signInWithGoogle();
      
      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }
      
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  register: async (email: string, password: string, userData: any) => {
    try {
      set({ isLoading: true });
      const supabase = await import('../services/supabase');
      const { data, error } = await supabase.default.signUp(email, password, userData);
      
      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }
      
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      const supabase = await import('../services/supabase');
      await supabase.default.signOut();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Mock authenticated user for testing
      const mockUser: User = {
        id: 'current-user',
        email: 'user@example.com',
        username: 'fashion_lover',
        full_name: 'Alex Smith',
        avatar_url: 'https://via.placeholder.com/80',
        bio: 'Fashion enthusiast | Style blogger | Always looking for the next trend',
        points_balance: 1250,
        referral_code: 'ALEX123',
        privacy_settings: {
          profile_visibility: 'public',
          show_email: false,
          show_phone: false,
          allow_tagging: true,
          wardrobe_backup: 'cloud_sync',
          location_sharing: true,
          data_analytics: true,
        },
        is_verified: true,
        is_moderator: false,
        posts_count: 42,
        followers_count: 1234,
        following_count: 567,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  updateUser: (updates: Partial<User>) => {
    set(state => ({
      user: state.user ? { ...state.user, ...updates } : null
    }));
  }
}));

// Feed Store
export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  hasMore: true,

  fetchPosts: async (refresh = false) => {
    try {
      set({ isLoading: true });
      
      // Mock posts for now
      const mockPosts: (Post & { is_liked?: boolean })[] = [
        {
          id: '1',
          user_id: 'user1',
          caption: 'Summer vibes in this amazing outfit! Perfect for the beach 🏖️ #SummerStyle #BeachFashion',
          images: ['https://via.placeholder.com/400'],
          hashtags: ['SummerStyle', 'BeachFashion'],
          mentions: [],
          location: 'Miami Beach',
          likes_count: 234,
          comments_count: 45,
          shares_count: 12,
          hearts_count: 89,
          is_reported: false,
          is_hidden: false,
          is_liked: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user1',
            email: 'sarah@example.com',
            username: 'fashionista_123',
            full_name: 'Sarah Johnson',
            avatar_url: 'https://via.placeholder.com/40',
            is_verified: true,
            points_balance: 1250,
            referral_code: 'SARAH123',
            privacy_settings: {
              profile_visibility: 'public',
              show_email: false,
              show_phone: false,
              allow_tagging: true,
              wardrobe_backup: 'cloud_sync',
              location_sharing: true,
              data_analytics: true,
            },
            is_moderator: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          }
        },
        {
          id: '2',
          user_id: 'user2',
          caption: 'Street style inspiration from downtown 🏙️ #UrbanFashion #StreetStyle',
          images: ['https://via.placeholder.com/400'],
          hashtags: ['UrbanFashion', 'StreetStyle'],
          mentions: [],
          location: 'New York City',
          likes_count: 567,
          comments_count: 89,
          shares_count: 34,
          hearts_count: 201,
          is_reported: false,
          is_hidden: false,
          is_liked: true,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user2',
            email: 'mike@example.com',
            username: 'style_guru',
            full_name: 'Mike Chen',
            avatar_url: 'https://via.placeholder.com/40',
            is_verified: false,
            points_balance: 890,
            referral_code: 'MIKE456',
            privacy_settings: {
              profile_visibility: 'public',
              show_email: false,
              show_phone: false,
              allow_tagging: true,
              wardrobe_backup: 'local_only',
              location_sharing: false,
              data_analytics: false,
            },
            is_moderator: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          }
        },
      ];
      
      set({
        posts: mockPosts,
        hasMore: false,
        cursor: undefined,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Fetch posts error:', error);
    }
  },

  likePost: async (postId: string) => {
    try {
      const { user } = useAuthStore.getState();
      
      if (!user) return;
      
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes_count: post.likes_count + 1,
                is_liked: true
              }
            : post
        )
      }));
    } catch (error) {
      console.error('Like post error:', error);
    }
  },

  unlikePost: async (postId: string) => {
    try {
      const { user } = useAuthStore.getState();
      
      if (!user) return;
      
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes_count: Math.max(0, post.likes_count - 1),
                is_liked: false
              }
            : post
        )
      }));
    } catch (error) {
      console.error('Unlike post error:', error);
    }
  },

  createPost: async (post) => {
    try {
      const { supabase } = await import('../services/supabase');
      const response = await supabase.createPost(post);
      
      if (response.data) {
        set(state => ({
          posts: [response.data, ...state.posts]
        }));
      }
    } catch (error) {
      console.error('Create post error:', error);
    }
  }
}));

// Wardrobe Store
export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  wardrobes: [],
  items: [],
  selectedWardrobe: null,
  isLoading: false,

  fetchWardrobes: async () => {
    try {
      set({ isLoading: true });
      
      // Mock wardrobes for now
      const mockWardrobes: Wardrobe[] = [
        {
          id: '1',
          user_id: 'current-user',
          name: 'Summer Collection',
          description: 'Light and breezy outfits for hot weather',
          is_public: false,
          items_count: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'current-user',
          name: 'Work Attire',
          description: 'Professional outfits for the office',
          is_public: false,
          items_count: 8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          user_id: 'current-user',
          name: 'Weekend Casual',
          description: 'Comfortable clothes for days off',
          is_public: true,
          access_code: 'WEEKEND123',
          items_count: 15,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      
      set({
        wardrobes: mockWardrobes,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Fetch wardrobes error:', error);
    }
  },

  fetchItems: async (wardrobeId: string) => {
    try {
      set({ isLoading: true });
      // Mock items for now
      const mockItems: WardrobeItem[] = [
        {
          id: '1',
          wardrobe_id: wardrobeId,
          name: 'White T-Shirt',
          category: 'tops',
          brand: 'Uniqlo',
          color: 'white',
          size: 'M',
          image_url: 'https://via.placeholder.com/150',
          ai_tags: ['casual', 'basic', 'versatile'],
          is_favorite: true,
          times_worn: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          wardrobe_id: wardrobeId,
          name: 'Blue Jeans',
          category: 'bottoms',
          brand: 'Levi\'s',
          color: 'blue',
          size: '32',
          image_url: 'https://via.placeholder.com/150',
          ai_tags: ['casual', 'denim', 'classic'],
          is_favorite: false,
          times_worn: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      
      set({
        items: mockItems,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Fetch items error:', error);
    }
  },

  createWardrobe: async (wardrobe) => {
    try {
      const { supabase } = await import('../services/supabase');
      const { user } = useAuthStore.getState();
      
      if (!user) return;
      
      const response = await supabase.createWardrobe({
        ...wardrobe,
        user_id: user.id
      });
      
      if (response.data) {
        set(state => ({
          wardrobes: [response.data, ...state.wardrobes]
        }));
      }
    } catch (error) {
      console.error('Create wardrobe error:', error);
    }
  },

  selectWardrobe: (wardrobe) => {
    set({ selectedWardrobe: wardrobe });
  }
}));

// Competition Store
export const useCompetitionStore = create<CompetitionState>((set) => ({
  competitions: [],
  isLoading: false,

  fetchCompetitions: async () => {
    try {
      set({ isLoading: true });
      // Mock competitions for now
      const mockCompetitions: Competition[] = [
        {
          id: '1',
          title: 'Summer Style Challenge',
          description: 'Show off your best summer outfit! The most creative and stylish look wins.',
          type: 'weekly_challenge',
          hashtag: '#SummerStyle2024',
          sponsor: 'Fashion Brand X',
          prize_description: '$500 shopping spree + featured post',
          rules: [
            'Must include at least 3 items',
            'Summer theme required',
            'Original content only',
            'Use hashtag #SummerStyle2024'
          ],
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          entries_count: 127,
          max_entries_per_user: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Street Style Fashion Week',
          description: 'Urban fashion at its finest. Show us your best street style look.',
          type: 'daily_theme',
          hashtag: '#StreetStyleWeek',
          sponsor: 'Urban Outfitters',
          prize_description: 'Feature on our Instagram page',
          rules: [
            'Street style aesthetic',
            'Urban environment background',
            'Original content only'
          ],
          start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'upcoming',
          entries_count: 0,
          max_entries_per_user: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Vintage Fashion Contest',
          description: 'Retro looks that never go out of style.',
          type: 'brand_collab',
          hashtag: '#VintageVibes',
          sponsor: 'Vintage Store',
          prize_description: '$200 vintage shopping credit',
          rules: [
            'Vintage or retro-inspired outfit',
            'At least one vintage item',
            'Creative styling encouraged'
          ],
          start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          entries_count: 89,
          max_entries_per_user: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      
      set({
        competitions: mockCompetitions,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Fetch competitions error:', error);
    }
  },

  enterCompetition: async (competitionId: string) => {
    try {
      // Mock entry for now
      console.log('Entering competition:', competitionId);
      // In a real app, this would call the Supabase service
    } catch (error) {
      console.error('Enter competition error:', error);
      throw error;
    }
  }
}));

// Notification Store
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const { supabase } = await import('../services/supabase');
      const { user } = useAuthStore.getState();
      
      if (!user) return;
      
      const response = await supabase.getNotifications(user.id);
      
      const notifications = response.data || [];
      const unreadCount = notifications.filter(n => !n.is_read).length;
      
      set({
        notifications,
        unreadCount,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Fetch notifications error:', error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const { supabase } = await import('../services/supabase');
      await supabase.markNotificationAsRead(notificationId);
      
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Mark notification as read error:', error);
    }
  }
}));