'use client';

import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();

  useEffect(() => {
    // Show welcome toast when page loads
    toast({
      title: "🎉 Welcome to Fashion Social App!",
      description: "Scan the QR code on this page to access the mobile version instantly.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Fashion Social App
          </h1>
          <p className="text-xl text-gray-700 mb-8 font-medium">
            Your style, your community - Mobile Fashion Experience
          </p>
          
          {/* Large QR Code Display */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 max-w-md mx-auto border-4 border-purple-500 hover:shadow-3xl transition-shadow">
            <h2 className="text-3xl font-bold text-purple-600 mb-6">📱 Scan for Mobile</h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:3000" 
                alt="QR Code for Fashion Social App - Scan with phone camera" 
                className="w-56 h-56 mx-auto border-6 border-white shadow-xl rounded-lg"
              />
            </div>
            <p className="text-base text-gray-700 mb-6 font-medium">
              Point your phone camera at this QR code to open the Fashion Social App
            </p>
            <div className="flex gap-3 justify-center">
              <a 
                href="/fashion-demo" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 Open App Now
              </a>
              <a 
                href="/qr-scanner" 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                📷 QR Scanner
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <h2 className="text-white text-2xl font-bold text-center">
              📱 Mobile Fashion Experience
            </h2>
            <p className="text-purple-100 text-center mt-2">Interactive Social Platform</p>
          </div>
          
          <div className="p-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
              <h3 className="font-bold text-xl mb-4 text-green-800">✨ Features Available:</h3>
              <ul className="space-y-3 text-base">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span className="font-medium">Social Feed with Posts & Interactions</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span className="font-medium">Fashion Competitions & Prizes</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span className="font-medium">Digital Wardrobe Management</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span className="font-medium">User Profiles & Points System</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✓</span>
                  <span className="font-medium">Like, Comment & Share Features</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
              <h3 className="font-bold text-xl mb-4 text-blue-800">🎯 Try Interactive Demo:</h3>
              <a 
                href="/fashion-demo" 
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-lg mb-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Launch Fashion Social App
              </a>
              <a 
                href="/qr-scanner" 
                className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-4 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                📱 QR Scanner for Mobile
              </a>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Experience the complete fashion social platform in your browser
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-purple-200">
              <h3 className="font-bold text-xl mb-4 text-purple-800">📱 Quick Mobile Access:</h3>
              <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-xl border-2 border-purple-200 mb-4 shadow-lg">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000" 
                    alt="QR Code for Fashion Social App" 
                    className="w-36 h-36"
                  />
                </div>
                <p className="text-base text-gray-700 mb-4 font-medium">
                  Scan with your phone camera to open the app
                </p>
                <div className="flex gap-3 justify-center">
                  <a 
                    href="/fashion-demo" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Open App
                  </a>
                  <a 
                    href="/qr-scanner" 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    QR Scanner
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 mb-6 border border-orange-200">
              <h3 className="font-bold text-xl mb-4 text-orange-800">📱 App Screens:</h3>
              <div className="grid grid-cols-2 gap-4 text-base">
                <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center mb-2 text-2xl">🏠</div>
                  <div className="font-semibold">Feed</div>
                  <div className="text-sm text-gray-600">Social posts</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center mb-2 text-2xl">👔</div>
                  <div className="font-semibold">Wardrobe</div>
                  <div className="text-sm text-gray-600">Outfit collection</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center mb-2 text-2xl">🏆</div>
                  <div className="font-semibold">Competitions</div>
                  <div className="text-sm text-gray-600">Fashion contests</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center mb-2 text-2xl">👤</div>
                  <div className="font-semibold">Profile</div>
                  <div className="text-sm text-gray-600">User settings</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
              <h3 className="font-bold text-xl mb-4 text-green-800">🎯 Current Status:</h3>
              <div className="space-y-3 text-base">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="font-medium">Complete Web App Interface</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="font-medium">All UI Components Implemented</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="font-medium">Interactive Features Working</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="font-medium">TypeScript Integration</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3 text-lg">✅</span>
                  <span className="font-medium">Responsive Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-700 mb-6 text-lg max-w-3xl mx-auto leading-relaxed">
            The Fashion Social App is a complete web application built with Next.js, 
            TypeScript, and Tailwind CSS, featuring social media functionality, fashion competitions, 
            and wardrobe management - all accessible through your browser.
          </p>
          <div className="space-x-4">
            <a 
              href="/about" 
              className="inline-block bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Learn More
            </a>
            <a 
              href="/fashion-demo" 
              className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try App Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}