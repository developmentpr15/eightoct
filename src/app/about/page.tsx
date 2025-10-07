export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Fashion Social App
          </h1>
          <p className="text-xl text-gray-600">
            Your style, your community - Mobile Fashion Experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">🎯 Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Fashion Social App connects fashion enthusiasts worldwide, creating a vibrant community 
              where style meets social interaction. We empower users to express their unique fashion 
              sense, discover trends, and participate in exciting competitions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-pink-600">✨ Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become the leading platform for fashion social networking, where everyone can 
              showcase their style, get inspired by others, and turn their fashion passion into 
              rewarding experiences through competitions and community engagement.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">🚀 Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">Social Feed</h3>
              <p className="text-sm text-gray-600">
                Share your outfits, get likes and comments, follow fashion influencers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-semibold mb-2">Fashion Competitions</h3>
              <p className="text-sm text-gray-600">
                Participate in daily challenges, win prizes, and get featured
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">👔</div>
              <h3 className="font-semibold mb-2">Digital Wardrobe</h3>
              <p className="text-sm text-gray-600">
                Organize your clothes, get outfit suggestions, manage your style
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">🛠 Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Frontend</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Next.js 15 with App Router</li>
                <li>• TypeScript for type safety</li>
                <li>• Tailwind CSS for styling</li>
                <li>• shadcn/ui components</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Interactive UI components</li>
                <li>• Real-time interactions</li>
                <li>• Points and rewards system</li>
                <li>• User profiles and statistics</li>
                <li>• Mobile-first design</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            ← Back to Home
          </a>
          <a 
            href="/fashion-demo" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors ml-4"
          >
            Try the App Demo →
          </a>
        </div>
      </div>
    </div>
  );
}