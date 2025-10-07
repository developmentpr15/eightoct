# 7ftrends - Fashion Social App

**Post it. Pair it. Wear it. Win it.**

A comprehensive fashion social mobile app built with Flutter and Supabase, featuring social feeds, wardrobe management, AI try-on capabilities, and fashion competitions.

## 🎯 Features

### 📱 Core Features
- **Social Feed**: Share fashion posts, like, comment, and follow others
- **Digital Wardrobe**: Organize and manage your clothing items by category
- **AI Try-On**: Virtual try-on experience with AI-powered outfit suggestions
- **Fashion Competitions**: Participate in themed competitions and win prizes
- **User Profiles**: Personal profiles with points system and achievements

### 🏗️ Technical Stack
- **Frontend**: Flutter with Material Design 3
- **Backend**: Supabase (PostgreSQL + Real-time)
- **State Management**: Provider pattern
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Storage**: Supabase Storage for images
- **AI Integration**: Custom AI service for try-on and recommendations

## 🚀 Getting Started

### Prerequisites
- Flutter SDK (>=3.0.0)
- Dart SDK
- Supabase Account
- Google Cloud Account (for AI services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 7ftrends
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema provided in `database/schema.sql`
   - Configure Authentication providers
   - Set up Storage buckets for images

4. **Configure environment variables**
   ```dart
   // lib/main.dart
   await Supabase.initialize(
     url: 'YOUR_SUPABASE_URL',
     anonKey: 'YOUR_SUPABASE_ANON_KEY',
   );
   ```

5. **Add app assets**
   - Add your logo to `assets/logo.png`
   - Add any additional images to `assets/images/`

6. **Run the app**
   ```bash
   flutter run
   ```

## 📱 App Structure

### Navigation
The app features a bottom navigation with 5 main sections:

1. **Feed** (🏠): Social feed with fashion posts
2. **Wardrobe** (👔): Digital wardrobe management
3. **AI Try-On** (✨): Central AI-powered try-on feature
4. **Competitions** (🏆): Fashion competitions and prizes
5. **Profile** (👤): User profile and settings

### Key Screens

#### Feed Screen
- Browse fashion posts from followed users
- Like, comment, and share posts
- Create new posts with multiple images
- Search for users and hashtags
- Follow/unfollow other users

#### Wardrobe Screen
- Organize clothing by categories (Tops, Bottoms, Outerwear, etc.)
- Add items with photos, brand, size, color details
- Mark favorite items
- Track wear count and last worn date
- AI-powered tagging and categorization

#### AI Try-On Screen
- Upload user avatar for realistic try-on
- Select multiple clothing items to try
- Generate AI-powered try-on images
- Save and share generated looks
- AR-style virtual fitting room

#### Competition Screen
- Browse active and upcoming competitions
- Enter competitions with hashtag posts
- Vote for favorite entries
- View winners and prizes
- Track participation history

#### Profile Screen
- User profile with avatar and bio
- Points balance and rewards store
- Followers/following stats
- Achievement badges
- Settings and preferences

## 🗄️ Database Schema

### Core Tables
- `users`: User profiles and authentication
- `posts`: Social media posts
- `wardrobe_items`: Clothing items management
- `competitions`: Fashion competitions
- `competition_entries`: Competition submissions
- `likes`, `comments`, `follows`: Social interactions

### Key Features
- Real-time updates with Supabase subscriptions
- Row Level Security (RLS) for data privacy
- Automatic timestamps and soft deletes
- Full-text search capabilities

## 🎨 Design System

### Colors
- **Primary**: `#7C4DFF` (Purple)
- **Secondary**: `#B388FF` (Light Purple)
- **Accent**: `#FF6B6B` (Coral)
- **Neutral**: Shades of grey

### Typography
- **Font**: Google Fonts (Poppins)
- **Headings**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Captions**: Regular, 12px

### Components
- Material Design 3 components
- Custom gradient buttons
- Card-based layouts
- Smooth animations and transitions

## 🔧 Development

### State Management
Using Provider pattern for state management:
- `AuthProvider`: User authentication and profile
- `FeedProvider`: Social feed and posts
- `WardrobeProvider`: Wardrobe items management
- `CompetitionProvider`: Competition data

### Services
- `AuthService`: Authentication and user management
- `FeedService`: Social feed functionality
- `WardrobeService`: Wardrobe CRUD operations
- `CompetitionService`: Competition management
- `AITryOnService`: AI-powered features

### API Integration
- Supabase client for database operations
- Real-time subscriptions for live updates
- File upload to Supabase Storage
- Google Vision API for AI tagging

## 📸 Screenshots

[Add screenshots of the app here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact:
- Email: support@7ftrends.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Basic social feed functionality
- ✅ Wardrobe management
- ✅ User profiles and authentication
- ✅ Competition system
- ✅ AI try-on (basic)

### Version 1.1 (Planned)
- 🔄 Advanced AI recommendations
- 🔄 Outfit suggestions based on weather
- 🔄 Social sharing to external platforms
- 🔄 In-app messaging
- 🔄 Video posts support

### Version 2.0 (Future)
- 📋 AR integration with device camera
- 📋 Fashion marketplace integration
- 📋 Brand partnerships
- 📋 Advanced analytics dashboard
- 📋 Multi-language support

---

**Made with ❤️ for fashion enthusiasts worldwide**