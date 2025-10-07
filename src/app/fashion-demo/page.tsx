'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share2, Bookmark, Plus, Trophy, User, Home, Shirt } from 'lucide-react';

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    username: 'fashionista_123',
    fullName: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    caption: 'Summer vibes in this amazing outfit! Perfect for the beach 🏖️ #SummerStyle #BeachFashion',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    caption: 'Street style inspiration from downtown 🏙️ #UrbanFashion #StreetStyle',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
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

export default function FashionSocialDemo() {
  const [posts, setPosts] = useState(mockPosts);
  const [activeTab, setActiveTab] = useState('feed');

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
    <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.avatar} />
              <AvatarFallback>{post.username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">{post.username}</span>
                {post.isVerified && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-600">✓</Badge>}
              </div>
              <div className="text-xs text-gray-500">{post.fullName} • {post.timestamp}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">⋯</Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative mb-3">
            <img 
                src={post.image} 
                alt="Fashion outfit post" 
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                }}
            />
            <div className="hidden bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                    <div className="text-5xl mb-2">📸</div>
                    <div className="text-sm font-medium">Fashion Outfit</div>
                    <div className="text-xs">Tap to view</div>
                </div>
            </div>
        </div>
        <p className="text-sm mb-2 leading-relaxed">{post.caption}</p>
        {post.location && (
          <p className="text-xs text-gray-500 mb-3 flex items-center">
            <span className="mr-1">📍</span> {post.location}
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleLike(post.id)}
            className="flex items-center space-x-1 hover:bg-pink-50"
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-xs font-medium">{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-blue-50">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-green-50">
            <Share2 className="h-4 w-4" />
            <span className="text-xs font-medium">{post.shares}</span>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-yellow-50">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CompetitionCard = ({ competition }: { competition: any }) => (
    <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{competition.title}</CardTitle>
          <Badge variant={competition.status === 'active' ? 'default' : 'secondary'} 
                 className={competition.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
            {competition.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{competition.description}</p>
        <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="text-sm"><span className="font-semibold">Hashtag:</span> 
            <span className="text-blue-600 ml-1">{competition.hashtag}</span>
          </div>
          <div className="text-sm"><span className="font-semibold">Sponsor:</span> {competition.sponsor}</div>
          <div className="text-sm"><span className="font-semibold text-amber-600">Prize:</span> 🏆 {competition.prize}</div>
          <div className="text-sm"><span className="font-semibold">Entries:</span> {competition.entries}</div>
          <div className="text-sm"><span className="font-semibold">Ends:</span> {competition.endDate}</div>
        </div>
        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl">
          {competition.status === 'active' ? 'Enter Competition' : 
           competition.status === 'upcoming' ? 'Notify Me' : 
           'View Winners'}
        </Button>
      </CardContent>
    </Card>
  );

  const WardrobeCard = ({ wardrobe }: { wardrobe: any }) => (
    <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{wardrobe.name}</CardTitle>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {wardrobe.items} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{wardrobe.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm flex items-center">
            {wardrobe.isPublic ? 
              <><span className="mr-1">🌐</span> Public</> : 
              <><span className="mr-1">🔒</span> Private</>
          }
          </span>
          <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300">
            Open Wardrobe
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Fashion Social</h1>
          <p className="text-sm text-gray-500 text-center">Your style, your community</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 sticky top-20 z-10 bg-white shadow-lg border-b">
            <TabsTrigger value="feed" className="flex items-center space-x-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="wardrobe" className="flex items-center space-x-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Shirt className="h-4 w-4" />
              <span className="hidden sm:inline">Wardrobe</span>
            </TabsTrigger>
            <TabsTrigger value="competitions" className="flex items-center space-x-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Competitions</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="feed" className="mt-0">
              <h2 className="text-lg font-semibold mb-4">Your Feed</h2>
              {posts.map(post => <PostCard key={post.id} post={post} />)}
            </TabsContent>

            <TabsContent value="competitions" className="mt-0">
              <h2 className="text-lg font-semibold mb-4">Fashion Competitions</h2>
              {mockCompetitions.map(competition => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </TabsContent>

            <TabsContent value="wardrobe" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">My Wardrobes</h2>
                <Button size="sm" className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl">
                  <Plus className="h-4 w-4" />
                  <span>Add Wardrobe</span>
                </Button>
              </div>
              {mockWardrobes.map(wardrobe => (
                <WardrobeCard key={wardrobe.id} wardrobe={wardrobe} />
              ))}
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <Card className="shadow-lg">
                <CardHeader className="text-center bg-gradient-to-br from-purple-50 to-pink-50">
                  <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
                    <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" />
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white">AS</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">Alex Smith</CardTitle>
                  <p className="text-gray-500 font-medium">@fashion_lover</p>
                  <p className="text-sm text-gray-600 mt-2 max-w-xs mx-auto">
                    Fashion enthusiast | Style blogger | Always looking for the next trend
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-bold text-lg">42</div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-bold text-lg">1.2K</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-bold text-lg">567</div>
                      <div className="text-xs text-gray-500">Following</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3 rounded-lg">
                      <div className="font-bold text-lg text-amber-600">1,250</div>
                      <div className="text-xs text-gray-500">Points</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                      <h3 className="font-semibold mb-3 flex items-center text-amber-800">
                        <Trophy className="h-5 w-5 mr-2" />
                        Points & Rewards
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Current Balance: <span className="font-bold text-amber-600">1,250 points</span>
                      </p>
                      <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                        View Rewards Store
                      </Button>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}