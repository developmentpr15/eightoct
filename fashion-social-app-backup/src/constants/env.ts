// Environment variables for Fashion Social App
export const ENV = {
  // Supabase Configuration
  SUPABASE_URL: 'https://elquosmpqghmehnycytw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscXVvc21wcWdobWVobnljeXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTEyOTQsImV4cCI6MjA3NDk2NzI5NH0.CgGn3r6cdP6RNUtWr3oRlfty3XwoC8oFYftmSIaQoco',
  
  // API Keys
  OPENWEATHER_API_KEY: '7eba163fb75499e23a45563e0c0b05e6',
  GOOGLE_VISION_API_KEY: 'AIzaSyBt9EWKyGjxTcZknmNoLaNiFB3UjQIzn_A',
  
  // App Configuration
  APP_NAME: 'Fashion Social',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_AR_FEATURE: process.env.EXPO_PUBLIC_ENABLE_AR_FEATURE === 'true',
  ENABLE_SHOPPING: process.env.EXPO_PUBLIC_ENABLE_SHOPPING === 'true',
  
  // Points System
  POINTS: {
    SHARE: 50,
    REFERRAL: 200,
    DAILY_LOGIN: 10,
    COMPETITION_ENTRY: 25,
    COMPETITION_WIN: 500,
  },
  
  // API Limits
  MAX_IMAGES_PER_POST: 10,
  MAX_WARDROBE_ITEMS: 1000,
  MAX_COMPETITION_ENTRIES: 3,
} as const;

export default ENV;