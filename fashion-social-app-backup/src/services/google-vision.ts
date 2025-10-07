// Google Vision API Service
import ENV from '../constants/env';

interface VisionApiResponse {
  responses: Array<{
    labelAnnotations: Array<{
      description: string;
      score: number;
      topicality: number;
    }>;
    imagePropertiesAnnotation?: {
      dominantColors: {
        colors: Array<{
          color: {
            red: number;
            green: number;
            blue: number;
            alpha: number;
          };
          score: number;
          pixelFraction: number;
        }>;
      };
    };
    webDetection?: {
      webEntities: Array<{
        description: string;
        score: number;
      }>;
    };
  }>;
}

interface ClothingAnalysis {
  items: string[];
  colors: string[];
  style: string[];
  confidence: number;
}

class GoogleVisionService {
  private apiKey: string;
  private baseUrl: string = 'https://vision.googleapis.com/v1';

  constructor() {
    this.apiKey = ENV.GOOGLE_VISION_API_KEY;
  }

  /**
   * Analyze clothing image for fashion items, colors, and style
   */
  async analyzeClothing(imageBase64: string): Promise<ClothingAnalysis> {
    try {
      const requestBody = {
        requests: [
          {
            image: {
              content: imageBase64,
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10,
              },
              {
                type: 'IMAGE_PROPERTIES',
                maxResults: 5,
              },
              {
                type: 'WEB_DETECTION',
                maxResults: 10,
              },
            ],
          },
        ],
      };

      const response = await fetch(
        `${this.baseUrl}/images:annotate?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data: VisionApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(`Vision API error: ${data.responses?.[0]?.error?.message || 'Unknown error'}`);
      }

      return this.parseVisionResponse(data.responses[0]);
    } catch (error) {
      console.error('Google Vision API error:', error);
      throw error;
    }
  }

  /**
   * Parse Vision API response for fashion-related items
   */
  private parseVisionResponse(response: any): ClothingAnalysis {
    const items: string[] = [];
    const colors: string[] = [];
    const style: string[] = [];
    let totalConfidence = 0;
    let validDetections = 0;

    // Extract labels (clothing items, accessories, etc.)
    if (response.labelAnnotations) {
      response.labelAnnotations.forEach((label: any) => {
        const description = label.description.toLowerCase();
        const score = label.score;
        
        // Fashion-related keywords
        const fashionKeywords = [
          'shirt', 'dress', 'pants', 'jacket', 'coat', 'skirt', 'shorts',
          't-shirt', 'blouse', 'sweater', 'hoodie', 'jeans', 'trousers',
          'shoes', 'sneakers', 'boots', 'sandals', 'heels', 'flats',
          'bag', 'handbag', 'backpack', 'purse', 'wallet',
          'hat', 'cap', 'beanie', 'sunglasses', 'glasses',
          'watch', 'jewelry', 'necklace', 'earrings', 'bracelet',
          'scarf', 'belt', 'gloves', 'tie', 'bow tie'
        ];

        if (fashionKeywords.some(keyword => description.includes(keyword))) {
          items.push(label.description);
          totalConfidence += score;
          validDetections++;
        }

        // Style-related keywords
        const styleKeywords = [
          'fashion', 'style', 'casual', 'formal', 'elegant', 'sport',
          'vintage', 'modern', 'classic', 'trendy', 'chic', 'urban'
        ];

        if (styleKeywords.some(keyword => description.includes(keyword))) {
          style.push(label.description);
        }
      });
    }

    // Extract dominant colors
    if (response.imagePropertiesAnnotation?.dominantColors?.colors) {
      response.imagePropertiesAnnotation.dominantColors.colors.forEach((colorObj: any) => {
        const rgb = colorObj.color;
        const colorName = this.rgbToColorName(rgb.red, rgb.green, rgb.blue);
        if (colorName && colorObj.score > 0.01) {
          colors.push(colorName);
        }
      });
    }

    // Extract web entities for additional style context
    if (response.webDetection?.webEntities) {
      response.webDetection.webEntities.forEach((entity: any) => {
        const description = entity.description.toLowerCase();
        if (entity.score > 0.5 && (
          description.includes('fashion') ||
          description.includes('style') ||
          description.includes('clothing') ||
          description.includes('outfit')
        )) {
          style.push(entity.description);
        }
      });
    }

    const averageConfidence = validDetections > 0 ? totalConfidence / validDetections : 0;

    return {
      items: [...new Set(items)], // Remove duplicates
      colors: [...new Set(colors)],
      style: [...new Set(style)],
      confidence: averageConfidence,
    };
  }

  /**
   * Convert RGB values to color names
   */
  private rgbToColorName(r: number, g: number, b: number): string | null {
    // Normalize RGB values
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;

    // Calculate hue, saturation, and lightness
    const max = Math.max(normalizedR, normalizedG, normalizedB);
    const min = Math.min(normalizedR, normalizedG, normalizedB);
    const delta = max - min;

    let hue = 0;
    if (delta !== 0) {
      if (max === normalizedR) {
        hue = ((normalizedG - normalizedB) / delta) % 6;
      } else if (max === normalizedG) {
        hue = (normalizedB - normalizedR) / delta + 2;
      } else {
        hue = (normalizedR - normalizedG) / delta + 4;
      }
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;

    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

    // Map to color names
    if (saturation < 0.1) {
      if (lightness < 0.2) return 'black';
      if (lightness > 0.8) return 'white';
      return 'gray';
    }

    if (lightness < 0.2) {
      if (hue < 20 || hue > 340) return 'dark red';
      if (hue < 40) return 'dark orange';
      if (hue < 60) return 'dark yellow';
      if (hue < 120) return 'dark green';
      if (hue < 240) return 'dark blue';
      if (hue < 280) return 'dark purple';
      return 'dark pink';
    }

    if (lightness > 0.8) {
      if (hue < 20 || hue > 340) return 'light red';
      if (hue < 40) return 'light orange';
      if (hue < 60) return 'light yellow';
      if (hue < 120) return 'light green';
      if (hue < 240) return 'light blue';
      if (hue < 280) return 'light purple';
      return 'light pink';
    }

    // Medium lightness colors
    if (hue < 20 || hue > 340) return 'red';
    if (hue < 40) return 'orange';
    if (hue < 60) return 'yellow';
    if (hue < 80) return 'lime';
    if (hue < 120) return 'green';
    if (hue < 140) return 'teal';
    if (hue < 160) return 'cyan';
    if (hue < 200) return 'blue';
    if (hue < 240) return 'indigo';
    if (hue < 280) return 'purple';
    if (hue < 320) return 'pink';
    return 'magenta';
  }

  /**
   * Batch analyze multiple images
   */
  async analyzeMultipleImages(imagesBase64: string[]): Promise<ClothingAnalysis[]> {
    try {
      const promises = imagesBase64.map(image => this.analyzeClothing(image));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Batch analysis error:', error);
      throw error;
    }
  }

  /**
   * Get fashion suggestions based on analysis
   */
  async getFashionSuggestions(analysis: ClothingAnalysis): Promise<string[]> {
    const suggestions: string[] = [];

    // Item-based suggestions
    if (analysis.items.includes('dress')) {
      suggestions.push('Pair with heels and a clutch for an elegant look');
      suggestions.push('Add a denim jacket for a casual vibe');
    }

    if (analysis.items.includes('jeans')) {
      suggestions.push('Perfect with a t-shirt for casual outings');
      suggestions.push('Dress up with a blazer for smart casual');
    }

    // Color-based suggestions
    if (analysis.colors.includes('black')) {
      suggestions.push('Black goes with everything - add colorful accessories');
    }

    if (analysis.colors.includes('white')) {
      suggestions.push('White is versatile - pair with any color');
    }

    // Style-based suggestions
    if (analysis.style.includes('casual')) {
      suggestions.push('Great for everyday wear - comfortable and stylish');
    }

    if (analysis.style.includes('formal')) {
      suggestions.push('Perfect for business meetings or formal events');
    }

    return suggestions;
  }
}

export default new GoogleVisionService();