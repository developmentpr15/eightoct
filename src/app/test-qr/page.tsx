'use client';

import React from 'react';

export default function TestQRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-8">QR Code Test Page</h1>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">📱 Scan This QR Code</h2>
          
          <div className="flex justify-center mb-6">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=http://localhost:3001/fashion-demo" 
              alt="Test QR Code" 
              className="border-4 border-purple-500 rounded-lg shadow-lg"
            />
          </div>
          
          <p className="text-lg text-gray-700 mb-4">
            This QR code will take you directly to the Fashion Social App demo
          </p>
          
          <div className="space-y-4">
            <a 
              href="/fashion-demo" 
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg"
            >
              🚀 Go to Fashion App
            </a>
            
            <br />
            
            <a 
              href="/" 
              className="inline-block bg-gray-600 text-white px-8 py-4 rounded-lg hover:bg-gray-700 transition-colors font-bold text-lg"
            >
              ← Back to Home
            </a>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">📋 Instructions</h3>
          <ol className="text-left space-y-2 text-gray-700">
            <li>1. Open your phone camera app</li>
            <li>2. Point it at the QR code above</li>
            <li>3. Tap the link that appears</li>
            <li>4. Enjoy the Fashion Social App!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}