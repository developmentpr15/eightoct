'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Plus, 
  Camera,
  Search,
  Home,
  ShoppingBag,
  Trophy,
  User,
  MoreHorizontal,
  Star,
  Clock,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    username: 'fashionista_123',
    fullName: 'Sarah Johnson',
    avatar: 'https://via.placeholder.com/40',
    caption: 'Summer vibes in this amazing outfit! Perfect for the beach 🏖️ #SummerStyle #BeachFashion',
    image: 'https://via.placeholder.com/400x300/87CEEB/FFFFFF?text=Summer+Outfit',
    likes: 234,
    comments: 45,
    shares: 12,
    isLiked: false,
    location: 'Miami Beach',
    isVerified: true,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    username: 'style_guru',
    fullName: 'Mike Chen',
    avatar: 'https://via.placeholder.com/40',
    caption: 'Street style inspiration from downtown 🏙️ #UrbanFashion #StreetStyle',
    image: 'https://via.placeholder.com/400x300/708090/FFFFFF?text=Street+Style',
    likes: 567,
    comments: 89,
    shares: 34,
    isLiked: true,
    location: 'New York City',
    isVerified: false,
    timestamp: '4 hours ago'
  }
];

const mockCompetitions = [
  {
    id: '1',
    title: 'Summer Style Challenge',
    description: 'Show off your best summer outfit! The most creative and stylish look wins.',
    hashtag: '#SummerStyle2024',
    sponsor: 'Fashion Brand X',
    prize: '$500 shopping spree + featured post',
    status: 'active',
    entries: 127,
    endDate: '7 days'
  },
  {
    id: '2',
    title: 'Street Style Fashion Week',
    description: 'Urban fashion at its finest. Show us your best street style look.',
    hashtag: '#StreetStyleWeek',
    sponsor: 'Urban Outfitters',
    prize: 'Feature on our Instagram page',
    status: 'upcoming',
    entries: 0,
    endDate: 'Starts tomorrow'
  }
];

const mockWardrobes = [
  {
    id: '1',
    name: 'Summer Collection',
    description: 'Light and breezy outfits for hot weather',
    items: 12,
    isPublic: false
  },
  {
    id: '2',
    name: 'Work Attire',
    description: 'Professional outfits for the office',
    items: 8,
    isPublic: false
  },
  {
    id: '3',
    name: 'Weekend Casual',
    description: 'Comfortable clothes for days off',
    items: 15,
    isPublic: true
  }
];

export default function FashionSocialApp() {
  const [posts, setPosts] = useState(mockPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          }
        : post
    ));
  };

  const PostCard = ({ post }: { post: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.avatar} />
              <AvatarFallback>{post.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{post.username}</span>
                {post.isVerified && <Badge variant="secondary" className="text-xs">✓</Badge>}
              </div>
              <span className="text-sm text-gray-600">{post.fullName}</span>
              <span className="text-xs text-gray-500">{post.timestamp}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <img 
          src={post.image} 
          alt={post.caption}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="mb-2">{post.caption}</p>
        {post.location && (
          <p className="text-sm text-gray-600 mb-4">📍 {post.location}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleLike(post.id)}
              className={post.isLiked ? 'text-red-500' : ''}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
              {post.shares}
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CompetitionCard = ({ competition }: { competition: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{competition.title}</CardTitle>
          <Badge 
            variant={competition.status === 'active' ? 'default' : 'secondary'}
            className={
              competition.status === 'active' ? 'bg-green-500' :
              competition.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
            }
          >
            {competition.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{competition.description}</p>
        <div className="space-y-2 mb-4">
          <p className="text-sm"><strong>Hashtag:</strong> #{competition.hashtag}</p>
          <p className="text-sm"><strong>Sponsor:</strong> {competition.sponsor}</p>
          <p className="text-sm"><strong>Prize:</strong> 🏆 {competition.prize}</p>
          <p className="text-sm"><strong>Entries:</strong> {competition.entries}</p>
          <p className="text-sm"><strong>Ends:</strong> {competition.endDate}</p>
        </div>
        <Button className="w-full">
          {competition.status === 'active' ? 'Enter Competition' : 
           competition.status === 'upcoming' ? 'Notify Me' : 
           'View Winners'}
        </Button>
      </CardContent>
    </Card>
  );

  const WardrobeCard = ({ wardrobe }: { wardrobe: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{wardrobe.name}</CardTitle>
          <Badge variant="outline">{wardrobe.items} items</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{wardrobe.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {wardrobe.isPublic ? '🌐 Public' : '🔒 Private'}
          </span>
          <Button variant="outline">Open</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">Fashion Social</h1>
          <p className="text-sm text-gray-600 text-center">Your style, your community</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-4 sticky top-16 z-10 bg-white">
            <TabsTrigger value="feed" className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="wardrobe" className="flex items-center space-x-1">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Wardrobe</span>
            </TabsTrigger>
            <TabsTrigger value="competitions" className="flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Competitions</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="p-4">
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wardrobe" className="p-4">
            <div className="space-y-4">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New Wardrobe
              </Button>
              {mockWardrobes.map(wardrobe => (
                <WardrobeCard key={wardrobe.id} wardrobe={wardrobe} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="competitions" className="p-4">
            <div className="space-y-4">
              {mockCompetitions.map(competition => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="p-4">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="https://via.placeholder.com/80" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <CardTitle>Alex Smith</CardTitle>
                <CardDescription>@fashion_lover</CardDescription>
                <p className="text-sm text-gray-600 mt-2">
                  Fashion enthusiast | Style blogger | Always looking for the next trend
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center mb-6">
                  <div>
                    <div className="text-lg font-bold">42</div>
                    <div className="text-xs text-gray-600">Posts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">1.2K</div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">567</div>
                    <div className="text-xs text-gray-600">Following</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">1,250</div>
                    <div className="text-xs text-gray-600">Points</div>
                  </div>
                </div>
                <Button className="w-full mb-6">Edit Profile</Button>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Points & Rewards
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Current Balance: 1,250 points
                  </p>
                  <Button variant="outline" className="w-full">
                    View Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <Button size="lg" className="rounded-full w-14 h-14">
          <Camera className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}