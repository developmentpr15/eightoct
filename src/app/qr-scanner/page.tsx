'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Smartphone, Monitor, ArrowRight } from 'lucide-react';

export default function QRScannerPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Get the current URL for QR code
    if (typeof window !== 'undefined') {
      const url = window.location.origin;
      setCurrentUrl(url);
      
      // Generate QR code URL using a free QR code API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrApiUrl);
    }
  }, []);

  const openMobileApp = () => {
    // Open the fashion demo in mobile view
    window.open('/fashion-demo', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">QR Scanner & Mobile Access</h1>
          </div>
          <p className="text-gray-600">
            Scan the QR code to access the Fashion Social App on your mobile device
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Code Card */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-purple-600" />
                Mobile QR Code
              </CardTitle>
              <CardDescription>
                Scan this code with your phone camera to open the app
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {qrCodeUrl ? (
                <div className="space-y-4">
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code for Fashion Social App" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Point your phone camera at this QR code
                    </p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✓ Ready to scan
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <p className="text-gray-500">Generating QR code...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-blue-600" />
                How to Access
              </CardTitle>
              <CardDescription>
                Multiple ways to experience the Fashion Social App
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 rounded-full p-2 mt-1">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Scan QR Code</h4>
                    <p className="text-sm text-gray-600">
                      Use your phone camera to scan the QR code
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Open Link</h4>
                    <p className="text-sm text-gray-600">
                      Tap the link that appears on your phone
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Experience App</h4>
                    <p className="text-sm text-gray-600">
                      Enjoy the mobile-optimized interface
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Direct Access:</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-mono text-gray-700 break-all">
                    {currentUrl}
                  </p>
                </div>
              </div>

              <Button 
                onClick={openMobileApp}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Open Fashion App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Preview */}
        <Card className="mt-6 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>🎉 What You'll Experience</CardTitle>
            <CardDescription>
              The complete Fashion Social App platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-1">📱</div>
                <h5 className="font-semibold text-sm">Social Feed</h5>
                <p className="text-xs text-gray-600">Posts & interactions</p>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-lg">
                <div className="text-2xl mb-1">👔</div>
                <h5 className="font-semibold text-sm">Wardrobe</h5>
                <p className="text-xs text-gray-600">Outfit management</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">🏆</div>
                <h5 className="font-semibold text-sm">Competitions</h5>
                <p className="text-xs text-gray-600">Fashion contests</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">👤</div>
                <h5 className="font-semibold text-sm">Profile</h5>
                <p className="text-xs text-gray-600">User settings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}